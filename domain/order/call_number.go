package order

type CallNumber struct {
	prefix string
	number uint16
}

func NewCallNumber(prefix string, number uint16) *CallNumber {
	return &CallNumber{
		prefix: prefix,
		number: number,
	}
}

func (callNumber *CallNumber) GetPrefix() string {
	return callNumber.prefix
}

func (callNumber *CallNumber) GetNumber() uint16 {
	return callNumber.number
}
