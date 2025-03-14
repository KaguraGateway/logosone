// DO NOT EDIT.
// swift-format-ignore-file
// swiftlint:disable all
//
// Generated by the Swift generator plugin for the protocol buffer compiler.
// Source: orderlink/orderlink_service.proto
//
// For information on using the generated types, please see the documentation:
//   https://github.com/apple/swift-protobuf/

import SwiftProtobuf

// If the compiler emits an error on this type, it is because this file
// was generated by a version of the `protoc` Swift plug-in that is
// incompatible with the version of SwiftProtobuf to which you are linking.
// Please ensure that you are building against the same version of the API
// that was used to generate this file.
fileprivate struct _GeneratedWithProtocGenSwiftVersion: SwiftProtobuf.ProtobufAPIVersionCheck {
  struct _2: SwiftProtobuf.ProtobufAPIVersion_2 {}
  typealias Version = _2
}

public struct Cafelogos_Orderlink_PostOrderItemInput: Sendable {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var productID: String = String()

  public var coffeeBrewID: String = String()

  public var quantity: UInt32 = 0

  /// 注文管理を行うかどうか
  public var isManagingOrder: Bool = false

  /// OrderLinkでキッチン機能を使うかどうか
  public var isOlKitchen: Bool = false

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public init() {}
}

public struct Cafelogos_Orderlink_PostOrderInput: Sendable {
  // SwiftProtobuf.Message conformance is added in an extension below. See the
  // `Message` and `Message+*Additions` files in the SwiftProtobuf library for
  // methods supported on all messages.

  public var orderID: String = String()

  public var orderAt: String = String()

  public var items: [Cafelogos_Orderlink_PostOrderItemInput] = []

  public var type: Cafelogos_Orderlink_PostOrderInput.OrderType = .eatIn

  public var ticketID: String = String()

  public var ticketAddr: String = String()

  public var seatName: String = String()

  public var unknownFields = SwiftProtobuf.UnknownStorage()

  public enum OrderType: SwiftProtobuf.Enum, Swift.CaseIterable {
    public typealias RawValue = Int
    case eatIn // = 0
    case takeOut // = 1
    case UNRECOGNIZED(Int)

    public init() {
      self = .eatIn
    }

    public init?(rawValue: Int) {
      switch rawValue {
      case 0: self = .eatIn
      case 1: self = .takeOut
      default: self = .UNRECOGNIZED(rawValue)
      }
    }

    public var rawValue: Int {
      switch self {
      case .eatIn: return 0
      case .takeOut: return 1
      case .UNRECOGNIZED(let i): return i
      }
    }

    // The compiler won't synthesize support with the UNRECOGNIZED case.
    public static let allCases: [Cafelogos_Orderlink_PostOrderInput.OrderType] = [
      .eatIn,
      .takeOut,
    ]

  }

  public init() {}
}

// MARK: - Code below here is support for the SwiftProtobuf runtime.

fileprivate let _protobuf_package = "cafelogos.orderlink"

extension Cafelogos_Orderlink_PostOrderItemInput: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".PostOrderItemInput"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .standard(proto: "product_id"),
    2: .standard(proto: "coffee_brew_id"),
    3: .same(proto: "quantity"),
    20: .standard(proto: "is_managing_order"),
    21: .standard(proto: "is_ol_kitchen"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularStringField(value: &self.productID) }()
      case 2: try { try decoder.decodeSingularStringField(value: &self.coffeeBrewID) }()
      case 3: try { try decoder.decodeSingularUInt32Field(value: &self.quantity) }()
      case 20: try { try decoder.decodeSingularBoolField(value: &self.isManagingOrder) }()
      case 21: try { try decoder.decodeSingularBoolField(value: &self.isOlKitchen) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.productID.isEmpty {
      try visitor.visitSingularStringField(value: self.productID, fieldNumber: 1)
    }
    if !self.coffeeBrewID.isEmpty {
      try visitor.visitSingularStringField(value: self.coffeeBrewID, fieldNumber: 2)
    }
    if self.quantity != 0 {
      try visitor.visitSingularUInt32Field(value: self.quantity, fieldNumber: 3)
    }
    if self.isManagingOrder != false {
      try visitor.visitSingularBoolField(value: self.isManagingOrder, fieldNumber: 20)
    }
    if self.isOlKitchen != false {
      try visitor.visitSingularBoolField(value: self.isOlKitchen, fieldNumber: 21)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Cafelogos_Orderlink_PostOrderItemInput, rhs: Cafelogos_Orderlink_PostOrderItemInput) -> Bool {
    if lhs.productID != rhs.productID {return false}
    if lhs.coffeeBrewID != rhs.coffeeBrewID {return false}
    if lhs.quantity != rhs.quantity {return false}
    if lhs.isManagingOrder != rhs.isManagingOrder {return false}
    if lhs.isOlKitchen != rhs.isOlKitchen {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Cafelogos_Orderlink_PostOrderInput: SwiftProtobuf.Message, SwiftProtobuf._MessageImplementationBase, SwiftProtobuf._ProtoNameProviding {
  public static let protoMessageName: String = _protobuf_package + ".PostOrderInput"
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    1: .standard(proto: "order_id"),
    2: .standard(proto: "order_at"),
    3: .same(proto: "items"),
    4: .same(proto: "type"),
    5: .standard(proto: "ticket_id"),
    6: .standard(proto: "ticket_addr"),
    7: .standard(proto: "seat_name"),
  ]

  public mutating func decodeMessage<D: SwiftProtobuf.Decoder>(decoder: inout D) throws {
    while let fieldNumber = try decoder.nextFieldNumber() {
      // The use of inline closures is to circumvent an issue where the compiler
      // allocates stack space for every case branch when no optimizations are
      // enabled. https://github.com/apple/swift-protobuf/issues/1034
      switch fieldNumber {
      case 1: try { try decoder.decodeSingularStringField(value: &self.orderID) }()
      case 2: try { try decoder.decodeSingularStringField(value: &self.orderAt) }()
      case 3: try { try decoder.decodeRepeatedMessageField(value: &self.items) }()
      case 4: try { try decoder.decodeSingularEnumField(value: &self.type) }()
      case 5: try { try decoder.decodeSingularStringField(value: &self.ticketID) }()
      case 6: try { try decoder.decodeSingularStringField(value: &self.ticketAddr) }()
      case 7: try { try decoder.decodeSingularStringField(value: &self.seatName) }()
      default: break
      }
    }
  }

  public func traverse<V: SwiftProtobuf.Visitor>(visitor: inout V) throws {
    if !self.orderID.isEmpty {
      try visitor.visitSingularStringField(value: self.orderID, fieldNumber: 1)
    }
    if !self.orderAt.isEmpty {
      try visitor.visitSingularStringField(value: self.orderAt, fieldNumber: 2)
    }
    if !self.items.isEmpty {
      try visitor.visitRepeatedMessageField(value: self.items, fieldNumber: 3)
    }
    if self.type != .eatIn {
      try visitor.visitSingularEnumField(value: self.type, fieldNumber: 4)
    }
    if !self.ticketID.isEmpty {
      try visitor.visitSingularStringField(value: self.ticketID, fieldNumber: 5)
    }
    if !self.ticketAddr.isEmpty {
      try visitor.visitSingularStringField(value: self.ticketAddr, fieldNumber: 6)
    }
    if !self.seatName.isEmpty {
      try visitor.visitSingularStringField(value: self.seatName, fieldNumber: 7)
    }
    try unknownFields.traverse(visitor: &visitor)
  }

  public static func ==(lhs: Cafelogos_Orderlink_PostOrderInput, rhs: Cafelogos_Orderlink_PostOrderInput) -> Bool {
    if lhs.orderID != rhs.orderID {return false}
    if lhs.orderAt != rhs.orderAt {return false}
    if lhs.items != rhs.items {return false}
    if lhs.type != rhs.type {return false}
    if lhs.ticketID != rhs.ticketID {return false}
    if lhs.ticketAddr != rhs.ticketAddr {return false}
    if lhs.seatName != rhs.seatName {return false}
    if lhs.unknownFields != rhs.unknownFields {return false}
    return true
  }
}

extension Cafelogos_Orderlink_PostOrderInput.OrderType: SwiftProtobuf._ProtoNameProviding {
  public static let _protobuf_nameMap: SwiftProtobuf._NameMap = [
    0: .same(proto: "EAT_IN"),
    1: .same(proto: "TAKE_OUT"),
  ]
}
