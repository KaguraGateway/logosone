package model

import (
	"github.com/KaguraGateway/logosone/logoregi-backend/domain"
	"github.com/oklog/ulid/v2"
)

type Client struct {
	id   string
	name string
}

func NewClient(name string) (*Client, error) {
	client := &Client{
		id: ulid.Make().String(),
	}
	if err := client.SetName(name); err != nil {
		return nil, err
	}
	return client, nil
}

func ReconstructClient(id string, name string) *Client {
	return &Client{
		id:   id,
		name: name,
	}
}

func (client *Client) GetId() string {
	return client.id
}

func (client *Client) GetName() string {
	return client.name
}

func (client *Client) SetName(name string) error {
	if len(name) == 0 {
		return domain.ErrClientNameInvalid
	}
	client.name = name
	return nil
}
