package square

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/KaguraGateway/logosone/logoregi-backend/application"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/model"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
	"log"
	"net/http"
	"os"
	"time"
)

const (
	SQUARE_CREATE_CHECKOUT = "https://connect.squareup.com/v2/terminals/checkouts"
	SQUARE_GET_CHECKOUT    = "https://connect.squareup.com/v2/terminals/checkouts"
	SQUARE_VERSION         = "2024-11-20"
)

type squarePaymentExternalService struct {
	paymentExternalRepo repository.PaymentExternalRepository
}

func NewSquarePaymentExternalService(i *do.Injector) (application.PaymentExternalService, error) {
	return &squarePaymentExternalService{
		paymentExternalRepo: do.MustInvoke[repository.PaymentExternalRepository](i),
	}, nil
}

type squareCreateCheckoutParam struct {
	IdempotencyKey string              `json:"idempotency_key"`
	Checkout       squareCheckoutParam `json:"checkout"`
}
type squareCreateCheckoutResponse struct {
	Checkout squareCheckout `json:"checkout"`
}

func (s squarePaymentExternalService) Create(ctx context.Context, payment *model.Payment, paymentExternal *model.PaymentExternal) error {
	param := squareCreateCheckoutParam{
		IdempotencyKey: paymentExternal.GetId(),
		Checkout: squareCheckoutParam{
			AmountMoney: squareAmountMoney{
				Amount:   int(payment.PaymentAmount),
				Currency: "JPY",
			},
			PaymentType: squarePaymentType(paymentExternal.GetPaymentType()),
			ReferenceId: paymentExternal.GetId(),
			Note:        "コーヒー",
			DeviceOptions: squareDeviceOptions{
				SkipReceiptScreen: false,
				DeviceId:          paymentExternal.GetExternalDeviceId(),
			},
		},
	}
	jsonParam, err := json.Marshal(param)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", SQUARE_CREATE_CHECKOUT, bytes.NewBuffer(jsonParam))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Square-Version", SQUARE_VERSION)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("SQUARE_API_TOKEN"))

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Printf("failed to create checkout: %v", err)
		return err
	}
	defer res.Body.Close()

	var response squareCreateCheckoutResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return err
	}
	log.Printf("response: %v", response)

	paymentExternal.SetExternalServiceId(response.Checkout.Id)
	paymentExternal.SetStatus(response.Checkout.Status)

	if err := s.paymentExternalRepo.Save(ctx, paymentExternal); err != nil {
		return err
	}

	return nil
}

func (s squarePaymentExternalService) UpdateByExternalId(ctx context.Context, externalId string) (*model.PaymentExternal, error) {
	req, err := http.NewRequest("GET", SQUARE_GET_CHECKOUT+"/"+externalId, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Square-Version", SQUARE_VERSION)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("SQUARE_API_TOKEN"))

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	defer res.Body.Close()

	var response squareCreateCheckoutResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, err
	}

	paymentExternal, err := s.paymentExternalRepo.FindById(ctx, response.Checkout.ReferenceId)
	if err != nil {
		return nil, err
	}

	paymentExternal.SetStatus(response.Checkout.Status)

	if err := s.paymentExternalRepo.Save(ctx, paymentExternal); err != nil {
		return nil, err
	}

	return paymentExternal, nil
}

func (s squarePaymentExternalService) pollingInternal(ctx context.Context) error {
	paymentExternals, err := s.paymentExternalRepo.FindAllByStatuses(ctx, []string{"PENDING", "IN_PROGRESS"})
	if err != nil {
		return err
	}

	for _, paymentExternal := range paymentExternals {
		if _, err := s.UpdateByExternalId(ctx, paymentExternal.GetExternalServiceId()); err != nil {
			return err
		}
	}
	return nil
}

func (s squarePaymentExternalService) Polling(ctx context.Context) error {
	log.Printf("start polling")
	go func() {
		for {
			if err := s.pollingInternal(ctx); err != nil {
				log.Printf("failed to polling: %v", err)
			}
			time.Sleep(3 * time.Second)
		}
	}()
	return nil
}
