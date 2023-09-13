// package: cafelogos
// file: proto/pos_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as proto_pos_service_pb from "../proto/pos_service_pb";
import * as proto_common_pb from "../proto/common_pb";

interface IPosServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getOrders: IPosServiceService_IGetOrders;
    postOrder: IPosServiceService_IPostOrder;
    getProducts: IPosServiceService_IGetProducts;
    getProductCategories: IPosServiceService_IGetProductCategories;
    postProductCategory: IPosServiceService_IPostProductCategory;
    postProduct: IPosServiceService_IPostProduct;
    updateProduct: IPosServiceService_IUpdateProduct;
    deleteProduct: IPosServiceService_IDeleteProduct;
    postStock: IPosServiceService_IPostStock;
    getStocks: IPosServiceService_IGetStocks;
    postCoffeeBean: IPosServiceService_IPostCoffeeBean;
    getCoffeeBeans: IPosServiceService_IGetCoffeeBeans;
    deleteAllOrders: IPosServiceService_IDeleteAllOrders;
}

interface IPosServiceService_IGetOrders extends grpc.MethodDefinition<proto_pos_service_pb.GetOrdersRequest, proto_pos_service_pb.GetOrdersResponse> {
    path: "/cafelogos.PosService/GetOrders";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.GetOrdersRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.GetOrdersRequest>;
    responseSerialize: grpc.serialize<proto_pos_service_pb.GetOrdersResponse>;
    responseDeserialize: grpc.deserialize<proto_pos_service_pb.GetOrdersResponse>;
}
interface IPosServiceService_IPostOrder extends grpc.MethodDefinition<proto_pos_service_pb.PostOrderRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/PostOrder";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.PostOrderRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.PostOrderRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IGetProducts extends grpc.MethodDefinition<proto_common_pb.Empty, proto_pos_service_pb.GetProductsResponse> {
    path: "/cafelogos.PosService/GetProducts";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_common_pb.Empty>;
    requestDeserialize: grpc.deserialize<proto_common_pb.Empty>;
    responseSerialize: grpc.serialize<proto_pos_service_pb.GetProductsResponse>;
    responseDeserialize: grpc.deserialize<proto_pos_service_pb.GetProductsResponse>;
}
interface IPosServiceService_IGetProductCategories extends grpc.MethodDefinition<proto_common_pb.Empty, proto_pos_service_pb.GetProductCategoriesResponse> {
    path: "/cafelogos.PosService/GetProductCategories";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_common_pb.Empty>;
    requestDeserialize: grpc.deserialize<proto_common_pb.Empty>;
    responseSerialize: grpc.serialize<proto_pos_service_pb.GetProductCategoriesResponse>;
    responseDeserialize: grpc.deserialize<proto_pos_service_pb.GetProductCategoriesResponse>;
}
interface IPosServiceService_IPostProductCategory extends grpc.MethodDefinition<proto_pos_service_pb.PostProductCategoryRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/PostProductCategory";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.PostProductCategoryRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.PostProductCategoryRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IPostProduct extends grpc.MethodDefinition<proto_pos_service_pb.PostProductRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/PostProduct";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.PostProductRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.PostProductRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IUpdateProduct extends grpc.MethodDefinition<proto_pos_service_pb.UpdateProductRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/UpdateProduct";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.UpdateProductRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.UpdateProductRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IDeleteProduct extends grpc.MethodDefinition<proto_pos_service_pb.DeleteProductRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/DeleteProduct";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.DeleteProductRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.DeleteProductRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IPostStock extends grpc.MethodDefinition<proto_pos_service_pb.PostStockRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/PostStock";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.PostStockRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.PostStockRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IGetStocks extends grpc.MethodDefinition<proto_common_pb.Empty, proto_pos_service_pb.GetStocksResponse> {
    path: "/cafelogos.PosService/GetStocks";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_common_pb.Empty>;
    requestDeserialize: grpc.deserialize<proto_common_pb.Empty>;
    responseSerialize: grpc.serialize<proto_pos_service_pb.GetStocksResponse>;
    responseDeserialize: grpc.deserialize<proto_pos_service_pb.GetStocksResponse>;
}
interface IPosServiceService_IPostCoffeeBean extends grpc.MethodDefinition<proto_pos_service_pb.PostCoffeeBeanRequest, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/PostCoffeeBean";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_pos_service_pb.PostCoffeeBeanRequest>;
    requestDeserialize: grpc.deserialize<proto_pos_service_pb.PostCoffeeBeanRequest>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}
interface IPosServiceService_IGetCoffeeBeans extends grpc.MethodDefinition<proto_common_pb.Empty, proto_pos_service_pb.GetCoffeeBeansResponse> {
    path: "/cafelogos.PosService/GetCoffeeBeans";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_common_pb.Empty>;
    requestDeserialize: grpc.deserialize<proto_common_pb.Empty>;
    responseSerialize: grpc.serialize<proto_pos_service_pb.GetCoffeeBeansResponse>;
    responseDeserialize: grpc.deserialize<proto_pos_service_pb.GetCoffeeBeansResponse>;
}
interface IPosServiceService_IDeleteAllOrders extends grpc.MethodDefinition<proto_common_pb.Empty, proto_common_pb.Empty> {
    path: "/cafelogos.PosService/DeleteAllOrders";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_common_pb.Empty>;
    requestDeserialize: grpc.deserialize<proto_common_pb.Empty>;
    responseSerialize: grpc.serialize<proto_common_pb.Empty>;
    responseDeserialize: grpc.deserialize<proto_common_pb.Empty>;
}

export const PosServiceService: IPosServiceService;

export interface IPosServiceServer extends grpc.UntypedServiceImplementation {
    getOrders: grpc.handleUnaryCall<proto_pos_service_pb.GetOrdersRequest, proto_pos_service_pb.GetOrdersResponse>;
    postOrder: grpc.handleUnaryCall<proto_pos_service_pb.PostOrderRequest, proto_common_pb.Empty>;
    getProducts: grpc.handleUnaryCall<proto_common_pb.Empty, proto_pos_service_pb.GetProductsResponse>;
    getProductCategories: grpc.handleUnaryCall<proto_common_pb.Empty, proto_pos_service_pb.GetProductCategoriesResponse>;
    postProductCategory: grpc.handleUnaryCall<proto_pos_service_pb.PostProductCategoryRequest, proto_common_pb.Empty>;
    postProduct: grpc.handleUnaryCall<proto_pos_service_pb.PostProductRequest, proto_common_pb.Empty>;
    updateProduct: grpc.handleUnaryCall<proto_pos_service_pb.UpdateProductRequest, proto_common_pb.Empty>;
    deleteProduct: grpc.handleUnaryCall<proto_pos_service_pb.DeleteProductRequest, proto_common_pb.Empty>;
    postStock: grpc.handleUnaryCall<proto_pos_service_pb.PostStockRequest, proto_common_pb.Empty>;
    getStocks: grpc.handleUnaryCall<proto_common_pb.Empty, proto_pos_service_pb.GetStocksResponse>;
    postCoffeeBean: grpc.handleUnaryCall<proto_pos_service_pb.PostCoffeeBeanRequest, proto_common_pb.Empty>;
    getCoffeeBeans: grpc.handleUnaryCall<proto_common_pb.Empty, proto_pos_service_pb.GetCoffeeBeansResponse>;
    deleteAllOrders: grpc.handleUnaryCall<proto_common_pb.Empty, proto_common_pb.Empty>;
}

export interface IPosServiceClient {
    getOrders(request: proto_pos_service_pb.GetOrdersRequest, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: proto_pos_service_pb.GetOrdersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    getOrders(request: proto_pos_service_pb.GetOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    postOrder(request: proto_pos_service_pb.PostOrderRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postOrder(request: proto_pos_service_pb.PostOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postOrder(request: proto_pos_service_pb.PostOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    getProducts(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductsResponse) => void): grpc.ClientUnaryCall;
    getProducts(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductsResponse) => void): grpc.ClientUnaryCall;
    getProducts(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductsResponse) => void): grpc.ClientUnaryCall;
    getProductCategories(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductCategoriesResponse) => void): grpc.ClientUnaryCall;
    getProductCategories(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductCategoriesResponse) => void): grpc.ClientUnaryCall;
    getProductCategories(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductCategoriesResponse) => void): grpc.ClientUnaryCall;
    postProductCategory(request: proto_pos_service_pb.PostProductCategoryRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postProductCategory(request: proto_pos_service_pb.PostProductCategoryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postProductCategory(request: proto_pos_service_pb.PostProductCategoryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postProduct(request: proto_pos_service_pb.PostProductRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postProduct(request: proto_pos_service_pb.PostProductRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postProduct(request: proto_pos_service_pb.PostProductRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    updateProduct(request: proto_pos_service_pb.UpdateProductRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    updateProduct(request: proto_pos_service_pb.UpdateProductRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    updateProduct(request: proto_pos_service_pb.UpdateProductRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteProduct(request: proto_pos_service_pb.DeleteProductRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteProduct(request: proto_pos_service_pb.DeleteProductRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteProduct(request: proto_pos_service_pb.DeleteProductRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postStock(request: proto_pos_service_pb.PostStockRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postStock(request: proto_pos_service_pb.PostStockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postStock(request: proto_pos_service_pb.PostStockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    getStocks(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetStocksResponse) => void): grpc.ClientUnaryCall;
    getStocks(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetStocksResponse) => void): grpc.ClientUnaryCall;
    getStocks(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetStocksResponse) => void): grpc.ClientUnaryCall;
    postCoffeeBean(request: proto_pos_service_pb.PostCoffeeBeanRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postCoffeeBean(request: proto_pos_service_pb.PostCoffeeBeanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    postCoffeeBean(request: proto_pos_service_pb.PostCoffeeBeanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    getCoffeeBeans(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetCoffeeBeansResponse) => void): grpc.ClientUnaryCall;
    getCoffeeBeans(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetCoffeeBeansResponse) => void): grpc.ClientUnaryCall;
    getCoffeeBeans(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetCoffeeBeansResponse) => void): grpc.ClientUnaryCall;
    deleteAllOrders(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteAllOrders(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteAllOrders(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class PosServiceClient extends grpc.Client implements IPosServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public getOrders(request: proto_pos_service_pb.GetOrdersRequest, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: proto_pos_service_pb.GetOrdersRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public getOrders(request: proto_pos_service_pb.GetOrdersRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetOrdersResponse) => void): grpc.ClientUnaryCall;
    public postOrder(request: proto_pos_service_pb.PostOrderRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postOrder(request: proto_pos_service_pb.PostOrderRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postOrder(request: proto_pos_service_pb.PostOrderRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public getProducts(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductsResponse) => void): grpc.ClientUnaryCall;
    public getProducts(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductsResponse) => void): grpc.ClientUnaryCall;
    public getProducts(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductsResponse) => void): grpc.ClientUnaryCall;
    public getProductCategories(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductCategoriesResponse) => void): grpc.ClientUnaryCall;
    public getProductCategories(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductCategoriesResponse) => void): grpc.ClientUnaryCall;
    public getProductCategories(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetProductCategoriesResponse) => void): grpc.ClientUnaryCall;
    public postProductCategory(request: proto_pos_service_pb.PostProductCategoryRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postProductCategory(request: proto_pos_service_pb.PostProductCategoryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postProductCategory(request: proto_pos_service_pb.PostProductCategoryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postProduct(request: proto_pos_service_pb.PostProductRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postProduct(request: proto_pos_service_pb.PostProductRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postProduct(request: proto_pos_service_pb.PostProductRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public updateProduct(request: proto_pos_service_pb.UpdateProductRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public updateProduct(request: proto_pos_service_pb.UpdateProductRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public updateProduct(request: proto_pos_service_pb.UpdateProductRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteProduct(request: proto_pos_service_pb.DeleteProductRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteProduct(request: proto_pos_service_pb.DeleteProductRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteProduct(request: proto_pos_service_pb.DeleteProductRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postStock(request: proto_pos_service_pb.PostStockRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postStock(request: proto_pos_service_pb.PostStockRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postStock(request: proto_pos_service_pb.PostStockRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public getStocks(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetStocksResponse) => void): grpc.ClientUnaryCall;
    public getStocks(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetStocksResponse) => void): grpc.ClientUnaryCall;
    public getStocks(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetStocksResponse) => void): grpc.ClientUnaryCall;
    public postCoffeeBean(request: proto_pos_service_pb.PostCoffeeBeanRequest, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postCoffeeBean(request: proto_pos_service_pb.PostCoffeeBeanRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public postCoffeeBean(request: proto_pos_service_pb.PostCoffeeBeanRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public getCoffeeBeans(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetCoffeeBeansResponse) => void): grpc.ClientUnaryCall;
    public getCoffeeBeans(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetCoffeeBeansResponse) => void): grpc.ClientUnaryCall;
    public getCoffeeBeans(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_pos_service_pb.GetCoffeeBeansResponse) => void): grpc.ClientUnaryCall;
    public deleteAllOrders(request: proto_common_pb.Empty, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteAllOrders(request: proto_common_pb.Empty, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteAllOrders(request: proto_common_pb.Empty, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_common_pb.Empty) => void): grpc.ClientUnaryCall;
}
