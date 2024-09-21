// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.34.2
// 	protoc        (unknown)
// source: orderlink/orderlink_service.proto

package orderlink

import (
	common "github.com/KaguraGateway/cafelogos-grpc/pkg/common"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type PostOrderInput_OrderType int32

const (
	PostOrderInput_EAT_IN   PostOrderInput_OrderType = 0
	PostOrderInput_TAKE_OUT PostOrderInput_OrderType = 1
)

// Enum value maps for PostOrderInput_OrderType.
var (
	PostOrderInput_OrderType_name = map[int32]string{
		0: "EAT_IN",
		1: "TAKE_OUT",
	}
	PostOrderInput_OrderType_value = map[string]int32{
		"EAT_IN":   0,
		"TAKE_OUT": 1,
	}
)

func (x PostOrderInput_OrderType) Enum() *PostOrderInput_OrderType {
	p := new(PostOrderInput_OrderType)
	*p = x
	return p
}

func (x PostOrderInput_OrderType) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (PostOrderInput_OrderType) Descriptor() protoreflect.EnumDescriptor {
	return file_orderlink_orderlink_service_proto_enumTypes[0].Descriptor()
}

func (PostOrderInput_OrderType) Type() protoreflect.EnumType {
	return &file_orderlink_orderlink_service_proto_enumTypes[0]
}

func (x PostOrderInput_OrderType) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use PostOrderInput_OrderType.Descriptor instead.
func (PostOrderInput_OrderType) EnumDescriptor() ([]byte, []int) {
	return file_orderlink_orderlink_service_proto_rawDescGZIP(), []int{1, 0}
}

type PostOrderItemInput struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	ProductId    string `protobuf:"bytes,1,opt,name=product_id,json=productId,proto3" json:"product_id,omitempty"`
	CoffeeBrewId string `protobuf:"bytes,2,opt,name=coffee_brew_id,json=coffeeBrewId,proto3" json:"coffee_brew_id,omitempty"`
	Quantity     uint32 `protobuf:"varint,3,opt,name=quantity,proto3" json:"quantity,omitempty"`
}

func (x *PostOrderItemInput) Reset() {
	*x = PostOrderItemInput{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orderlink_orderlink_service_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PostOrderItemInput) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PostOrderItemInput) ProtoMessage() {}

func (x *PostOrderItemInput) ProtoReflect() protoreflect.Message {
	mi := &file_orderlink_orderlink_service_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PostOrderItemInput.ProtoReflect.Descriptor instead.
func (*PostOrderItemInput) Descriptor() ([]byte, []int) {
	return file_orderlink_orderlink_service_proto_rawDescGZIP(), []int{0}
}

func (x *PostOrderItemInput) GetProductId() string {
	if x != nil {
		return x.ProductId
	}
	return ""
}

func (x *PostOrderItemInput) GetCoffeeBrewId() string {
	if x != nil {
		return x.CoffeeBrewId
	}
	return ""
}

func (x *PostOrderItemInput) GetQuantity() uint32 {
	if x != nil {
		return x.Quantity
	}
	return 0
}

type PostOrderInput struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	OrderId    string                   `protobuf:"bytes,1,opt,name=order_id,json=orderId,proto3" json:"order_id,omitempty"`
	OrderAt    string                   `protobuf:"bytes,2,opt,name=order_at,json=orderAt,proto3" json:"order_at,omitempty"`
	Items      []*PostOrderItemInput    `protobuf:"bytes,3,rep,name=items,proto3" json:"items,omitempty"`
	Type       PostOrderInput_OrderType `protobuf:"varint,4,opt,name=type,proto3,enum=cafelogos.orderlink.PostOrderInput_OrderType" json:"type,omitempty"`
	TicketId   string                   `protobuf:"bytes,5,opt,name=ticket_id,json=ticketId,proto3" json:"ticket_id,omitempty"`
	TicketAddr string                   `protobuf:"bytes,6,opt,name=ticket_addr,json=ticketAddr,proto3" json:"ticket_addr,omitempty"`
	SeatName   string                   `protobuf:"bytes,7,opt,name=seat_name,json=seatName,proto3" json:"seat_name,omitempty"`
}

func (x *PostOrderInput) Reset() {
	*x = PostOrderInput{}
	if protoimpl.UnsafeEnabled {
		mi := &file_orderlink_orderlink_service_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *PostOrderInput) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*PostOrderInput) ProtoMessage() {}

func (x *PostOrderInput) ProtoReflect() protoreflect.Message {
	mi := &file_orderlink_orderlink_service_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use PostOrderInput.ProtoReflect.Descriptor instead.
func (*PostOrderInput) Descriptor() ([]byte, []int) {
	return file_orderlink_orderlink_service_proto_rawDescGZIP(), []int{1}
}

func (x *PostOrderInput) GetOrderId() string {
	if x != nil {
		return x.OrderId
	}
	return ""
}

func (x *PostOrderInput) GetOrderAt() string {
	if x != nil {
		return x.OrderAt
	}
	return ""
}

func (x *PostOrderInput) GetItems() []*PostOrderItemInput {
	if x != nil {
		return x.Items
	}
	return nil
}

func (x *PostOrderInput) GetType() PostOrderInput_OrderType {
	if x != nil {
		return x.Type
	}
	return PostOrderInput_EAT_IN
}

func (x *PostOrderInput) GetTicketId() string {
	if x != nil {
		return x.TicketId
	}
	return ""
}

func (x *PostOrderInput) GetTicketAddr() string {
	if x != nil {
		return x.TicketAddr
	}
	return ""
}

func (x *PostOrderInput) GetSeatName() string {
	if x != nil {
		return x.SeatName
	}
	return ""
}

var File_orderlink_orderlink_service_proto protoreflect.FileDescriptor

var file_orderlink_orderlink_service_proto_rawDesc = []byte{
	0x0a, 0x21, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x6c, 0x69, 0x6e, 0x6b, 0x2f, 0x6f, 0x72, 0x64, 0x65,
	0x72, 0x6c, 0x69, 0x6e, 0x6b, 0x5f, 0x73, 0x65, 0x72, 0x76, 0x69, 0x63, 0x65, 0x2e, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x12, 0x13, 0x63, 0x61, 0x66, 0x65, 0x6c, 0x6f, 0x67, 0x6f, 0x73, 0x2e, 0x6f,
	0x72, 0x64, 0x65, 0x72, 0x6c, 0x69, 0x6e, 0x6b, 0x1a, 0x13, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e,
	0x2f, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x75, 0x0a,
	0x12, 0x50, 0x6f, 0x73, 0x74, 0x4f, 0x72, 0x64, 0x65, 0x72, 0x49, 0x74, 0x65, 0x6d, 0x49, 0x6e,
	0x70, 0x75, 0x74, 0x12, 0x1d, 0x0a, 0x0a, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74, 0x5f, 0x69,
	0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x09, 0x70, 0x72, 0x6f, 0x64, 0x75, 0x63, 0x74,
	0x49, 0x64, 0x12, 0x24, 0x0a, 0x0e, 0x63, 0x6f, 0x66, 0x66, 0x65, 0x65, 0x5f, 0x62, 0x72, 0x65,
	0x77, 0x5f, 0x69, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0c, 0x63, 0x6f, 0x66, 0x66,
	0x65, 0x65, 0x42, 0x72, 0x65, 0x77, 0x49, 0x64, 0x12, 0x1a, 0x0a, 0x08, 0x71, 0x75, 0x61, 0x6e,
	0x74, 0x69, 0x74, 0x79, 0x18, 0x03, 0x20, 0x01, 0x28, 0x0d, 0x52, 0x08, 0x71, 0x75, 0x61, 0x6e,
	0x74, 0x69, 0x74, 0x79, 0x22, 0xca, 0x02, 0x0a, 0x0e, 0x50, 0x6f, 0x73, 0x74, 0x4f, 0x72, 0x64,
	0x65, 0x72, 0x49, 0x6e, 0x70, 0x75, 0x74, 0x12, 0x19, 0x0a, 0x08, 0x6f, 0x72, 0x64, 0x65, 0x72,
	0x5f, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x6f, 0x72, 0x64, 0x65, 0x72,
	0x49, 0x64, 0x12, 0x19, 0x0a, 0x08, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x5f, 0x61, 0x74, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x41, 0x74, 0x12, 0x3d, 0x0a,
	0x05, 0x69, 0x74, 0x65, 0x6d, 0x73, 0x18, 0x03, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x27, 0x2e, 0x63,
	0x61, 0x66, 0x65, 0x6c, 0x6f, 0x67, 0x6f, 0x73, 0x2e, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x6c, 0x69,
	0x6e, 0x6b, 0x2e, 0x50, 0x6f, 0x73, 0x74, 0x4f, 0x72, 0x64, 0x65, 0x72, 0x49, 0x74, 0x65, 0x6d,
	0x49, 0x6e, 0x70, 0x75, 0x74, 0x52, 0x05, 0x69, 0x74, 0x65, 0x6d, 0x73, 0x12, 0x41, 0x0a, 0x04,
	0x74, 0x79, 0x70, 0x65, 0x18, 0x04, 0x20, 0x01, 0x28, 0x0e, 0x32, 0x2d, 0x2e, 0x63, 0x61, 0x66,
	0x65, 0x6c, 0x6f, 0x67, 0x6f, 0x73, 0x2e, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x6c, 0x69, 0x6e, 0x6b,
	0x2e, 0x50, 0x6f, 0x73, 0x74, 0x4f, 0x72, 0x64, 0x65, 0x72, 0x49, 0x6e, 0x70, 0x75, 0x74, 0x2e,
	0x4f, 0x72, 0x64, 0x65, 0x72, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x12,
	0x1b, 0x0a, 0x09, 0x74, 0x69, 0x63, 0x6b, 0x65, 0x74, 0x5f, 0x69, 0x64, 0x18, 0x05, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x08, 0x74, 0x69, 0x63, 0x6b, 0x65, 0x74, 0x49, 0x64, 0x12, 0x1f, 0x0a, 0x0b,
	0x74, 0x69, 0x63, 0x6b, 0x65, 0x74, 0x5f, 0x61, 0x64, 0x64, 0x72, 0x18, 0x06, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x0a, 0x74, 0x69, 0x63, 0x6b, 0x65, 0x74, 0x41, 0x64, 0x64, 0x72, 0x12, 0x1b, 0x0a,
	0x09, 0x73, 0x65, 0x61, 0x74, 0x5f, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x07, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x08, 0x73, 0x65, 0x61, 0x74, 0x4e, 0x61, 0x6d, 0x65, 0x22, 0x25, 0x0a, 0x09, 0x4f, 0x72,
	0x64, 0x65, 0x72, 0x54, 0x79, 0x70, 0x65, 0x12, 0x0a, 0x0a, 0x06, 0x45, 0x41, 0x54, 0x5f, 0x49,
	0x4e, 0x10, 0x00, 0x12, 0x0c, 0x0a, 0x08, 0x54, 0x41, 0x4b, 0x45, 0x5f, 0x4f, 0x55, 0x54, 0x10,
	0x01, 0x32, 0x5f, 0x0a, 0x10, 0x4f, 0x72, 0x64, 0x65, 0x72, 0x4c, 0x69, 0x6e, 0x6b, 0x53, 0x65,
	0x72, 0x76, 0x69, 0x63, 0x65, 0x12, 0x4b, 0x0a, 0x09, 0x50, 0x6f, 0x73, 0x74, 0x4f, 0x72, 0x64,
	0x65, 0x72, 0x12, 0x23, 0x2e, 0x63, 0x61, 0x66, 0x65, 0x6c, 0x6f, 0x67, 0x6f, 0x73, 0x2e, 0x6f,
	0x72, 0x64, 0x65, 0x72, 0x6c, 0x69, 0x6e, 0x6b, 0x2e, 0x50, 0x6f, 0x73, 0x74, 0x4f, 0x72, 0x64,
	0x65, 0x72, 0x49, 0x6e, 0x70, 0x75, 0x74, 0x1a, 0x17, 0x2e, 0x63, 0x61, 0x66, 0x65, 0x6c, 0x6f,
	0x67, 0x6f, 0x73, 0x2e, 0x63, 0x6f, 0x6d, 0x6d, 0x6f, 0x6e, 0x2e, 0x45, 0x6d, 0x70, 0x74, 0x79,
	0x22, 0x00, 0x42, 0x41, 0x5a, 0x3f, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d,
	0x2f, 0x4b, 0x61, 0x67, 0x75, 0x72, 0x61, 0x47, 0x61, 0x74, 0x65, 0x77, 0x61, 0x79, 0x2f, 0x63,
	0x61, 0x66, 0x65, 0x6c, 0x6f, 0x67, 0x6f, 0x73, 0x2d, 0x67, 0x72, 0x70, 0x63, 0x2f, 0x70, 0x6b,
	0x67, 0x2f, 0x6f, 0x72, 0x64, 0x65, 0x72, 0x6c, 0x69, 0x6e, 0x6b, 0x3b, 0x6f, 0x72, 0x64, 0x65,
	0x72, 0x6c, 0x69, 0x6e, 0x6b, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_orderlink_orderlink_service_proto_rawDescOnce sync.Once
	file_orderlink_orderlink_service_proto_rawDescData = file_orderlink_orderlink_service_proto_rawDesc
)

func file_orderlink_orderlink_service_proto_rawDescGZIP() []byte {
	file_orderlink_orderlink_service_proto_rawDescOnce.Do(func() {
		file_orderlink_orderlink_service_proto_rawDescData = protoimpl.X.CompressGZIP(file_orderlink_orderlink_service_proto_rawDescData)
	})
	return file_orderlink_orderlink_service_proto_rawDescData
}

var file_orderlink_orderlink_service_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_orderlink_orderlink_service_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_orderlink_orderlink_service_proto_goTypes = []any{
	(PostOrderInput_OrderType)(0), // 0: cafelogos.orderlink.PostOrderInput.OrderType
	(*PostOrderItemInput)(nil),    // 1: cafelogos.orderlink.PostOrderItemInput
	(*PostOrderInput)(nil),        // 2: cafelogos.orderlink.PostOrderInput
	(*common.Empty)(nil),          // 3: cafelogos.common.Empty
}
var file_orderlink_orderlink_service_proto_depIdxs = []int32{
	1, // 0: cafelogos.orderlink.PostOrderInput.items:type_name -> cafelogos.orderlink.PostOrderItemInput
	0, // 1: cafelogos.orderlink.PostOrderInput.type:type_name -> cafelogos.orderlink.PostOrderInput.OrderType
	2, // 2: cafelogos.orderlink.OrderLinkService.PostOrder:input_type -> cafelogos.orderlink.PostOrderInput
	3, // 3: cafelogos.orderlink.OrderLinkService.PostOrder:output_type -> cafelogos.common.Empty
	3, // [3:4] is the sub-list for method output_type
	2, // [2:3] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_orderlink_orderlink_service_proto_init() }
func file_orderlink_orderlink_service_proto_init() {
	if File_orderlink_orderlink_service_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_orderlink_orderlink_service_proto_msgTypes[0].Exporter = func(v any, i int) any {
			switch v := v.(*PostOrderItemInput); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_orderlink_orderlink_service_proto_msgTypes[1].Exporter = func(v any, i int) any {
			switch v := v.(*PostOrderInput); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_orderlink_orderlink_service_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_orderlink_orderlink_service_proto_goTypes,
		DependencyIndexes: file_orderlink_orderlink_service_proto_depIdxs,
		EnumInfos:         file_orderlink_orderlink_service_proto_enumTypes,
		MessageInfos:      file_orderlink_orderlink_service_proto_msgTypes,
	}.Build()
	File_orderlink_orderlink_service_proto = out.File
	file_orderlink_orderlink_service_proto_rawDesc = nil
	file_orderlink_orderlink_service_proto_goTypes = nil
	file_orderlink_orderlink_service_proto_depIdxs = nil
}