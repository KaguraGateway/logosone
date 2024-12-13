package http_server

import (
	"encoding/json"
	"github.com/KaguraGateway/logosone/logoregi-backend/domain/repository"
	"github.com/samber/do"
	"log"
	"net/http"
	"time"
)

type SquareTerminalWebhooks struct {
	paymentExternalRepo repository.PaymentExternalRepository
}

func NewSquareTerminalWebhooks(i *do.Injector) *SquareTerminalWebhooks {
	return &SquareTerminalWebhooks{
		paymentExternalRepo: do.MustInvoke[repository.PaymentExternalRepository](i),
	}
}

type squareRequestBody struct {
	MerchantId string    `json:"merchant_id"`
	Type       string    `json:"type"`
	EventId    string    `json:"event_id"`
	CreatedAt  time.Time `json:"created_at"`
	Data       struct {
		Type   string `json:"type"`
		Id     string `json:"id"`
		Object struct {
			Checkout struct {
				AmountMoney struct {
					Amount   int    `json:"amount"`
					Currency string `json:"currency"`
				} `json:"amount_money"`
				AppId            string    `json:"app_id"`
				CreatedAt        time.Time `json:"created_at"`
				DeadlineDuration string    `json:"deadline_duration"`
				DeviceOptions    struct {
					DeviceId          string `json:"device_id"`
					SkipReceiptScreen bool   `json:"skip_receipt_screen"`
				} `json:"device_options"`
				Id          string    `json:"id"`
				Note        string    `json:"note"`
				PaymentIds  []string  `json:"payment_ids"`
				ReferenceId string    `json:"reference_id"`
				Status      string    `json:"status"`
				UpdatedAt   time.Time `json:"updated_at"`
			} `json:"checkout"`
		} `json:"object"`
	} `json:"data"`
}

func (s *SquareTerminalWebhooks) Handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var body squareRequestBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if body.Type != "terminal.checkout.updated" {
		log.Printf("invalid type: %s", body.Type)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// FIXME: 完全にユースケースに移すべき
	paymentExternal, err := s.paymentExternalRepo.FindById(r.Context(), body.Data.Object.Checkout.ReferenceId)
	if err != nil {
		log.Printf("failed to find payment external by id: %v", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	paymentExternal.SetStatus(body.Data.Object.Checkout.Status)

	if err := s.paymentExternalRepo.Save(r.Context(), paymentExternal); err != nil {
		log.Printf("failed to find payment external by id: %v", err)
		w.WriteHeader(http.StatusNoContent)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
