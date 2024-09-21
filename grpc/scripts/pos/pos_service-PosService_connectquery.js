// @generated by protoc-gen-connect-query v0.4.4
// @generated from file pos/pos_service.proto (package cafelogos.pos, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { DeleteOrderRequest, DeleteProductRequest, GetCoffeeBeansResponse, GetDiscountsResponse, GetOrdersRequest, GetOrdersResponse, GetProductCategoriesResponse, GetProductsResponse, GetSeatsResponse, GetStocksResponse, GetUnpaidOrdersBySeatIdRequest, PaymentResponse, PostCoffeeBeanRequest, PostDiscountRequest, PostNewClientRequest, PostNewClientResponse, PostOrderRequest, PostOrderResponse, PostPaymentRequest, PostProductCategoryRequest, PostProductRequest, PostSeatRequest, PostStockRequest, UpdateClientRequest, UpdatePaymentRequest, UpdateProductRequest, UpdateSeatRequest } from "./pos_service_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
import { Empty } from "../common/common_pb.js";
import { createQueryService } from "@connectrpc/connect-query";

export const typeName = "cafelogos.pos.PosService";

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
     * @generated from rpc cafelogos.pos.PosService.GetUnpaidOrdersBySeatId
     */
    getUnpaidOrdersBySeatId: {
      name: "GetUnpaidOrdersBySeatId",
      I: GetUnpaidOrdersBySeatIdRequest,
      O: GetOrdersResponse,
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
     * @generated from rpc cafelogos.pos.PosService.PostPayment
     */
    postPayment: {
      name: "PostPayment",
      I: PostPaymentRequest,
      O: PaymentResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.UpdatePayment
     */
    updatePayment: {
      name: "UpdatePayment",
      I: UpdatePaymentRequest,
      O: PaymentResponse,
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
    /**
     * @generated from rpc cafelogos.pos.PosService.GetDiscounts
     */
    getDiscounts: {
      name: "GetDiscounts",
      I: Empty,
      O: GetDiscountsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * @generated from rpc cafelogos.pos.PosService.PostDiscount
     */
    postDiscount: {
      name: "PostDiscount",
      I: PostDiscountRequest,
      O: Empty,
      kind: MethodKind.Unary,
    },
  }
}

/**
 * @generated from rpc cafelogos.pos.PosService.GetOrders
 */
export const getOrders = createQueryService({
  service: PosService,
}).getOrders;

/**
 * @generated from rpc cafelogos.pos.PosService.GetUnpaidOrdersBySeatId
 */
export const getUnpaidOrdersBySeatId = createQueryService({
  service: PosService,
}).getUnpaidOrdersBySeatId;

/**
 * @generated from rpc cafelogos.pos.PosService.PostOrder
 */
export const postOrder = createQueryService({
  service: PosService,
}).postOrder;

/**
 * @generated from rpc cafelogos.pos.PosService.DeleteOrder
 */
export const deleteOrder = createQueryService({
  service: PosService,
}).deleteOrder;

/**
 * @generated from rpc cafelogos.pos.PosService.PostPayment
 */
export const postPayment = createQueryService({
  service: PosService,
}).postPayment;

/**
 * @generated from rpc cafelogos.pos.PosService.UpdatePayment
 */
export const updatePayment = createQueryService({
  service: PosService,
}).updatePayment;

/**
 * @generated from rpc cafelogos.pos.PosService.GetProducts
 */
export const getProducts = createQueryService({
  service: PosService,
}).getProducts;

/**
 * @generated from rpc cafelogos.pos.PosService.PostNewClient
 */
export const postNewClient = createQueryService({
  service: PosService,
}).postNewClient;

/**
 * @generated from rpc cafelogos.pos.PosService.UpdateClient
 */
export const updateClient = createQueryService({
  service: PosService,
}).updateClient;

/**
 * Only Admin
 *
 * @generated from rpc cafelogos.pos.PosService.GetProductCategories
 */
export const getProductCategories = createQueryService({
  service: PosService,
}).getProductCategories;

/**
 * @generated from rpc cafelogos.pos.PosService.PostProductCategory
 */
export const postProductCategory = createQueryService({
  service: PosService,
}).postProductCategory;

/**
 * @generated from rpc cafelogos.pos.PosService.PostProduct
 */
export const postProduct = createQueryService({
  service: PosService,
}).postProduct;

/**
 * @generated from rpc cafelogos.pos.PosService.UpdateProduct
 */
export const updateProduct = createQueryService({
  service: PosService,
}).updateProduct;

/**
 * @generated from rpc cafelogos.pos.PosService.DeleteProduct
 */
export const deleteProduct = createQueryService({
  service: PosService,
}).deleteProduct;

/**
 * @generated from rpc cafelogos.pos.PosService.PostStock
 */
export const postStock = createQueryService({
  service: PosService,
}).postStock;

/**
 * @generated from rpc cafelogos.pos.PosService.GetStocks
 */
export const getStocks = createQueryService({
  service: PosService,
}).getStocks;

/**
 * @generated from rpc cafelogos.pos.PosService.PostCoffeeBean
 */
export const postCoffeeBean = createQueryService({
  service: PosService,
}).postCoffeeBean;

/**
 * @generated from rpc cafelogos.pos.PosService.GetCoffeeBeans
 */
export const getCoffeeBeans = createQueryService({
  service: PosService,
}).getCoffeeBeans;

/**
 * @generated from rpc cafelogos.pos.PosService.DeleteAllOrders
 */
export const deleteAllOrders = createQueryService({
  service: PosService,
}).deleteAllOrders;

/**
 * @generated from rpc cafelogos.pos.PosService.PostSeat
 */
export const postSeat = createQueryService({
  service: PosService,
}).postSeat;

/**
 * @generated from rpc cafelogos.pos.PosService.UpdateSeat
 */
export const updateSeat = createQueryService({
  service: PosService,
}).updateSeat;

/**
 * @generated from rpc cafelogos.pos.PosService.GetSeats
 */
export const getSeats = createQueryService({
  service: PosService,
}).getSeats;

/**
 * @generated from rpc cafelogos.pos.PosService.GetDiscounts
 */
export const getDiscounts = createQueryService({
  service: PosService,
}).getDiscounts;

/**
 * @generated from rpc cafelogos.pos.PosService.PostDiscount
 */
export const postDiscount = createQueryService({
  service: PosService,
}).postDiscount;
