// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_pos_service_pb = require('../proto/pos_service_pb.js');
var proto_common_pb = require('../proto/common_pb.js');

function serialize_cafelogos_DeleteProductRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.DeleteProductRequest)) {
    throw new Error('Expected argument of type cafelogos.DeleteProductRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_DeleteProductRequest(buffer_arg) {
  return proto_pos_service_pb.DeleteProductRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_Empty(arg) {
  if (!(arg instanceof proto_common_pb.Empty)) {
    throw new Error('Expected argument of type cafelogos.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_Empty(buffer_arg) {
  return proto_common_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_GetCoffeeBeansResponse(arg) {
  if (!(arg instanceof proto_pos_service_pb.GetCoffeeBeansResponse)) {
    throw new Error('Expected argument of type cafelogos.GetCoffeeBeansResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_GetCoffeeBeansResponse(buffer_arg) {
  return proto_pos_service_pb.GetCoffeeBeansResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_GetOrdersRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.GetOrdersRequest)) {
    throw new Error('Expected argument of type cafelogos.GetOrdersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_GetOrdersRequest(buffer_arg) {
  return proto_pos_service_pb.GetOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_GetOrdersResponse(arg) {
  if (!(arg instanceof proto_pos_service_pb.GetOrdersResponse)) {
    throw new Error('Expected argument of type cafelogos.GetOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_GetOrdersResponse(buffer_arg) {
  return proto_pos_service_pb.GetOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_GetProductCategoriesResponse(arg) {
  if (!(arg instanceof proto_pos_service_pb.GetProductCategoriesResponse)) {
    throw new Error('Expected argument of type cafelogos.GetProductCategoriesResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_GetProductCategoriesResponse(buffer_arg) {
  return proto_pos_service_pb.GetProductCategoriesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_GetProductsResponse(arg) {
  if (!(arg instanceof proto_pos_service_pb.GetProductsResponse)) {
    throw new Error('Expected argument of type cafelogos.GetProductsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_GetProductsResponse(buffer_arg) {
  return proto_pos_service_pb.GetProductsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_GetStocksResponse(arg) {
  if (!(arg instanceof proto_pos_service_pb.GetStocksResponse)) {
    throw new Error('Expected argument of type cafelogos.GetStocksResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_GetStocksResponse(buffer_arg) {
  return proto_pos_service_pb.GetStocksResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_PostCoffeeBeanRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.PostCoffeeBeanRequest)) {
    throw new Error('Expected argument of type cafelogos.PostCoffeeBeanRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_PostCoffeeBeanRequest(buffer_arg) {
  return proto_pos_service_pb.PostCoffeeBeanRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_PostOrderRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.PostOrderRequest)) {
    throw new Error('Expected argument of type cafelogos.PostOrderRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_PostOrderRequest(buffer_arg) {
  return proto_pos_service_pb.PostOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_PostProductCategoryRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.PostProductCategoryRequest)) {
    throw new Error('Expected argument of type cafelogos.PostProductCategoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_PostProductCategoryRequest(buffer_arg) {
  return proto_pos_service_pb.PostProductCategoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_PostProductRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.PostProductRequest)) {
    throw new Error('Expected argument of type cafelogos.PostProductRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_PostProductRequest(buffer_arg) {
  return proto_pos_service_pb.PostProductRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_PostStockRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.PostStockRequest)) {
    throw new Error('Expected argument of type cafelogos.PostStockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_PostStockRequest(buffer_arg) {
  return proto_pos_service_pb.PostStockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_UpdateProductRequest(arg) {
  if (!(arg instanceof proto_pos_service_pb.UpdateProductRequest)) {
    throw new Error('Expected argument of type cafelogos.UpdateProductRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_UpdateProductRequest(buffer_arg) {
  return proto_pos_service_pb.UpdateProductRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var PosServiceService = exports.PosServiceService = {
  getOrders: {
    path: '/cafelogos.PosService/GetOrders',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.GetOrdersRequest,
    responseType: proto_pos_service_pb.GetOrdersResponse,
    requestSerialize: serialize_cafelogos_GetOrdersRequest,
    requestDeserialize: deserialize_cafelogos_GetOrdersRequest,
    responseSerialize: serialize_cafelogos_GetOrdersResponse,
    responseDeserialize: deserialize_cafelogos_GetOrdersResponse,
  },
  postOrder: {
    path: '/cafelogos.PosService/PostOrder',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.PostOrderRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_PostOrderRequest,
    requestDeserialize: deserialize_cafelogos_PostOrderRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  getProducts: {
    path: '/cafelogos.PosService/GetProducts',
    requestStream: false,
    responseStream: false,
    requestType: proto_common_pb.Empty,
    responseType: proto_pos_service_pb.GetProductsResponse,
    requestSerialize: serialize_cafelogos_Empty,
    requestDeserialize: deserialize_cafelogos_Empty,
    responseSerialize: serialize_cafelogos_GetProductsResponse,
    responseDeserialize: deserialize_cafelogos_GetProductsResponse,
  },
  // Only Admin
getProductCategories: {
    path: '/cafelogos.PosService/GetProductCategories',
    requestStream: false,
    responseStream: false,
    requestType: proto_common_pb.Empty,
    responseType: proto_pos_service_pb.GetProductCategoriesResponse,
    requestSerialize: serialize_cafelogos_Empty,
    requestDeserialize: deserialize_cafelogos_Empty,
    responseSerialize: serialize_cafelogos_GetProductCategoriesResponse,
    responseDeserialize: deserialize_cafelogos_GetProductCategoriesResponse,
  },
  postProductCategory: {
    path: '/cafelogos.PosService/PostProductCategory',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.PostProductCategoryRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_PostProductCategoryRequest,
    requestDeserialize: deserialize_cafelogos_PostProductCategoryRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  postProduct: {
    path: '/cafelogos.PosService/PostProduct',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.PostProductRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_PostProductRequest,
    requestDeserialize: deserialize_cafelogos_PostProductRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  updateProduct: {
    path: '/cafelogos.PosService/UpdateProduct',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.UpdateProductRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_UpdateProductRequest,
    requestDeserialize: deserialize_cafelogos_UpdateProductRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  deleteProduct: {
    path: '/cafelogos.PosService/DeleteProduct',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.DeleteProductRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_DeleteProductRequest,
    requestDeserialize: deserialize_cafelogos_DeleteProductRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  postStock: {
    path: '/cafelogos.PosService/PostStock',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.PostStockRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_PostStockRequest,
    requestDeserialize: deserialize_cafelogos_PostStockRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  getStocks: {
    path: '/cafelogos.PosService/GetStocks',
    requestStream: false,
    responseStream: false,
    requestType: proto_common_pb.Empty,
    responseType: proto_pos_service_pb.GetStocksResponse,
    requestSerialize: serialize_cafelogos_Empty,
    requestDeserialize: deserialize_cafelogos_Empty,
    responseSerialize: serialize_cafelogos_GetStocksResponse,
    responseDeserialize: deserialize_cafelogos_GetStocksResponse,
  },
  postCoffeeBean: {
    path: '/cafelogos.PosService/PostCoffeeBean',
    requestStream: false,
    responseStream: false,
    requestType: proto_pos_service_pb.PostCoffeeBeanRequest,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_PostCoffeeBeanRequest,
    requestDeserialize: deserialize_cafelogos_PostCoffeeBeanRequest,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
  getCoffeeBeans: {
    path: '/cafelogos.PosService/GetCoffeeBeans',
    requestStream: false,
    responseStream: false,
    requestType: proto_common_pb.Empty,
    responseType: proto_pos_service_pb.GetCoffeeBeansResponse,
    requestSerialize: serialize_cafelogos_Empty,
    requestDeserialize: deserialize_cafelogos_Empty,
    responseSerialize: serialize_cafelogos_GetCoffeeBeansResponse,
    responseDeserialize: deserialize_cafelogos_GetCoffeeBeansResponse,
  },
  deleteAllOrders: {
    path: '/cafelogos.PosService/DeleteAllOrders',
    requestStream: false,
    responseStream: false,
    requestType: proto_common_pb.Empty,
    responseType: proto_common_pb.Empty,
    requestSerialize: serialize_cafelogos_Empty,
    requestDeserialize: deserialize_cafelogos_Empty,
    responseSerialize: serialize_cafelogos_Empty,
    responseDeserialize: deserialize_cafelogos_Empty,
  },
};

exports.PosServiceClient = grpc.makeGenericClientConstructor(PosServiceService);
