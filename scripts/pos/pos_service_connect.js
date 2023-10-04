// @generated by protoc-gen-connect-es v1.0.0-rc1
// @generated from file pos/pos_service.proto (package cafelogos.pos, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { DeleteOrderRequest, DeleteProductRequest, GetCoffeeBeansResponse, GetOrderBySeatIdRequest, GetOrderResponse, GetOrdersRequest, GetOrdersResponse, GetProductCategoriesResponse, GetProductsResponse, GetSeatsResponse, GetStocksResponse, OrderPaymentResponse, PostCoffeeBeanRequest, PostNewClientRequest, PostNewClientResponse, PostOrderPaymentRequest, PostOrderRequest, PostOrderResponse, PostProductCategoryRequest, PostProductRequest, PostSeatRequest, PostStockRequest, UpdateClientRequest, UpdateOrderPaymentRequest, UpdateProductRequest, UpdateSeatRequest } from "./pos_service_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
import { Empty } from "../common/common_pb.js";

/**
 * @generated from service cafelogos.pos.PosService
 */
export const PosService = {
  typeName: "cafelogos.pos.PosService",
  methods: {
    /**
     * @generated from rpc cafelogos.pos.PosService.GetOrders
     */
    getOrders: {
      name: "GetOrders",
      I: GetOrdersRequest,
      O: GetOrdersResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.GetOrderBySeatId
     */
    getOrderBySeatId: {
      name: "GetOrderBySeatId",
      I: GetOrderBySeatIdRequest,
      O: GetOrderResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostOrder
     */
    postOrder: {
      name: "PostOrder",
      I: PostOrderRequest,
      O: PostOrderResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.DeleteOrder
     */
    deleteOrder: {
      name: "DeleteOrder",
      I: DeleteOrderRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostOrderPayment
     */
    postOrderPayment: {
      name: "PostOrderPayment",
      I: PostOrderPaymentRequest,
      O: OrderPaymentResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.UpdateOrderPayment
     */
    updateOrderPayment: {
      name: "UpdateOrderPayment",
      I: UpdateOrderPaymentRequest,
      O: OrderPaymentResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.GetProducts
     */
    getProducts: {
      name: "GetProducts",
      I: Empty,
      O: GetProductsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostNewClient
     */
    postNewClient: {
      name: "PostNewClient",
      I: PostNewClientRequest,
      O: PostNewClientResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.UpdateClient
     */
    updateClient: {
      name: "UpdateClient",
      I: UpdateClientRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * Only Admin
     *
     * @generated from rpc cafelogos.pos.PosService.GetProductCategories
     */
    getProductCategories: {
      name: "GetProductCategories",
      I: Empty,
      O: GetProductCategoriesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostProductCategory
     */
    postProductCategory: {
      name: "PostProductCategory",
      I: PostProductCategoryRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostProduct
     */
    postProduct: {
      name: "PostProduct",
      I: PostProductRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.UpdateProduct
     */
    updateProduct: {
      name: "UpdateProduct",
      I: UpdateProductRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.DeleteProduct
     */
    deleteProduct: {
      name: "DeleteProduct",
      I: DeleteProductRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostStock
     */
    postStock: {
      name: "PostStock",
      I: PostStockRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.GetStocks
     */
    getStocks: {
      name: "GetStocks",
      I: Empty,
      O: GetStocksResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostCoffeeBean
     */
    postCoffeeBean: {
      name: "PostCoffeeBean",
      I: PostCoffeeBeanRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.GetCoffeeBeans
     */
    getCoffeeBeans: {
      name: "GetCoffeeBeans",
      I: Empty,
      O: GetCoffeeBeansResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.DeleteAllOrders
     */
    deleteAllOrders: {
      name: "DeleteAllOrders",
      I: Empty,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostSeat
     */
    postSeat: {
      name: "PostSeat",
      I: PostSeatRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.UpdateSeat
     */
    updateSeat: {
      name: "UpdateSeat",
      I: UpdateSeatRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.GetSeats
     */
    getSeats: {
      name: "GetSeats",
      I: Empty,
      O: GetSeatsResponse,
      kind: MethodKind.Unary,
    },
  }
};

