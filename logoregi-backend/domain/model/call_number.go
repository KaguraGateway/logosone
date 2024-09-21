package model

type CallNumber struct {
	id    string
	value string
}

func ReconstructCallNumber(id string, value string) *CallNumber {
	return &CallNumber{
		id:    id,
		value: value,
	}
}

func (callNumber *CallNumber) GetId() string {
	return callNumber.id
}

func (callNumber *CallNumber) GetValue() string {
	return callNumber.value
}
