// package: cafelogos
// file: proto/pos_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as proto_common_pb from "../proto/common_pb";

export class GetOrdersRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOrdersRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetOrdersRequest): GetOrdersRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOrdersRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOrdersRequest;
    static deserializeBinaryFromReader(message: GetOrdersRequest, reader: jspb.BinaryReader): GetOrdersRequest;
}

export namespace GetOrdersRequest {
    export type AsObject = {
    }
}

export class GetOrdersResponse extends jspb.Message { 
    clearOrdersList(): void;
    getOrdersList(): Array<Order>;
    setOrdersList(value: Array<Order>): GetOrdersResponse;
    addOrders(value?: Order, index?: number): Order;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetOrdersResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetOrdersResponse): GetOrdersResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetOrdersResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetOrdersResponse;
    static deserializeBinaryFromReader(message: GetOrdersResponse, reader: jspb.BinaryReader): GetOrdersResponse;
}

export namespace GetOrdersResponse {
    export type AsObject = {
        ordersList: Array<Order.AsObject>,
    }
}

export class PostOrderRequest extends jspb.Message { 

    hasOrder(): boolean;
    clearOrder(): void;
    getOrder(): Order | undefined;
    setOrder(value?: Order): PostOrderRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostOrderRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PostOrderRequest): PostOrderRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostOrderRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostOrderRequest;
    static deserializeBinaryFromReader(message: PostOrderRequest, reader: jspb.BinaryReader): PostOrderRequest;
}

export namespace PostOrderRequest {
    export type AsObject = {
        order?: Order.AsObject,
    }
}

export class GetProductsResponse extends jspb.Message { 
    clearProductsList(): void;
    getProductsList(): Array<Product>;
    setProductsList(value: Array<Product>): GetProductsResponse;
    addProducts(value?: Product, index?: number): Product;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetProductsResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetProductsResponse): GetProductsResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetProductsResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetProductsResponse;
    static deserializeBinaryFromReader(message: GetProductsResponse, reader: jspb.BinaryReader): GetProductsResponse;
}

export namespace GetProductsResponse {
    export type AsObject = {
        productsList: Array<Product.AsObject>,
    }
}

export class GetProductCategoriesResponse extends jspb.Message { 
    clearProductCategoriesList(): void;
    getProductCategoriesList(): Array<ProductCategory>;
    setProductCategoriesList(value: Array<ProductCategory>): GetProductCategoriesResponse;
    addProductCategories(value?: ProductCategory, index?: number): ProductCategory;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetProductCategoriesResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetProductCategoriesResponse): GetProductCategoriesResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetProductCategoriesResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetProductCategoriesResponse;
    static deserializeBinaryFromReader(message: GetProductCategoriesResponse, reader: jspb.BinaryReader): GetProductCategoriesResponse;
}

export namespace GetProductCategoriesResponse {
    export type AsObject = {
        productCategoriesList: Array<ProductCategory.AsObject>,
    }
}

export class PostProductCategoryRequest extends jspb.Message { 

    hasProductCategory(): boolean;
    clearProductCategory(): void;
    getProductCategory(): ProductCategory | undefined;
    setProductCategory(value?: ProductCategory): PostProductCategoryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostProductCategoryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PostProductCategoryRequest): PostProductCategoryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostProductCategoryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostProductCategoryRequest;
    static deserializeBinaryFromReader(message: PostProductCategoryRequest, reader: jspb.BinaryReader): PostProductCategoryRequest;
}

export namespace PostProductCategoryRequest {
    export type AsObject = {
        productCategory?: ProductCategory.AsObject,
    }
}

export class PostProductRequest extends jspb.Message { 

    hasProduct(): boolean;
    clearProduct(): void;
    getProduct(): Product | undefined;
    setProduct(value?: Product): PostProductRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostProductRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PostProductRequest): PostProductRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostProductRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostProductRequest;
    static deserializeBinaryFromReader(message: PostProductRequest, reader: jspb.BinaryReader): PostProductRequest;
}

export namespace PostProductRequest {
    export type AsObject = {
        product?: Product.AsObject,
    }
}

export class UpdateProductRequest extends jspb.Message { 
    getProductId(): string;
    setProductId(value: string): UpdateProductRequest;

    hasProduct(): boolean;
    clearProduct(): void;
    getProduct(): Product | undefined;
    setProduct(value?: Product): UpdateProductRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpdateProductRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UpdateProductRequest): UpdateProductRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpdateProductRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpdateProductRequest;
    static deserializeBinaryFromReader(message: UpdateProductRequest, reader: jspb.BinaryReader): UpdateProductRequest;
}

export namespace UpdateProductRequest {
    export type AsObject = {
        productId: string,
        product?: Product.AsObject,
    }
}

export class DeleteProductRequest extends jspb.Message { 
    getProductId(): string;
    setProductId(value: string): DeleteProductRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteProductRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteProductRequest): DeleteProductRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteProductRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteProductRequest;
    static deserializeBinaryFromReader(message: DeleteProductRequest, reader: jspb.BinaryReader): DeleteProductRequest;
}

export namespace DeleteProductRequest {
    export type AsObject = {
        productId: string,
    }
}

export class PostStockRequest extends jspb.Message { 

    hasStock(): boolean;
    clearStock(): void;
    getStock(): Stock | undefined;
    setStock(value?: Stock): PostStockRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostStockRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PostStockRequest): PostStockRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostStockRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostStockRequest;
    static deserializeBinaryFromReader(message: PostStockRequest, reader: jspb.BinaryReader): PostStockRequest;
}

export namespace PostStockRequest {
    export type AsObject = {
        stock?: Stock.AsObject,
    }
}

export class GetStocksResponse extends jspb.Message { 
    clearStocksList(): void;
    getStocksList(): Array<Stock>;
    setStocksList(value: Array<Stock>): GetStocksResponse;
    addStocks(value?: Stock, index?: number): Stock;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetStocksResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetStocksResponse): GetStocksResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetStocksResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetStocksResponse;
    static deserializeBinaryFromReader(message: GetStocksResponse, reader: jspb.BinaryReader): GetStocksResponse;
}

export namespace GetStocksResponse {
    export type AsObject = {
        stocksList: Array<Stock.AsObject>,
    }
}

export class PostCoffeeBeanRequest extends jspb.Message { 

    hasCoffeeBean(): boolean;
    clearCoffeeBean(): void;
    getCoffeeBean(): CoffeeBean | undefined;
    setCoffeeBean(value?: CoffeeBean): PostCoffeeBeanRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PostCoffeeBeanRequest.AsObject;
    static toObject(includeInstance: boolean, msg: PostCoffeeBeanRequest): PostCoffeeBeanRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PostCoffeeBeanRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PostCoffeeBeanRequest;
    static deserializeBinaryFromReader(message: PostCoffeeBeanRequest, reader: jspb.BinaryReader): PostCoffeeBeanRequest;
}

export namespace PostCoffeeBeanRequest {
    export type AsObject = {
        coffeeBean?: CoffeeBean.AsObject,
    }
}

export class GetCoffeeBeansResponse extends jspb.Message { 
    clearCoffeeBeansList(): void;
    getCoffeeBeansList(): Array<CoffeeBean>;
    setCoffeeBeansList(value: Array<CoffeeBean>): GetCoffeeBeansResponse;
    addCoffeeBeans(value?: CoffeeBean, index?: number): CoffeeBean;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetCoffeeBeansResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetCoffeeBeansResponse): GetCoffeeBeansResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetCoffeeBeansResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetCoffeeBeansResponse;
    static deserializeBinaryFromReader(message: GetCoffeeBeansResponse, reader: jspb.BinaryReader): GetCoffeeBeansResponse;
}

export namespace GetCoffeeBeansResponse {
    export type AsObject = {
        coffeeBeansList: Array<CoffeeBean.AsObject>,
    }
}

export class Product extends jspb.Message { 
    getProductId(): string;
    setProductId(value: string): Product;
    getProductName(): string;
    setProductName(value: string): Product;

    hasProductCategory(): boolean;
    clearProductCategory(): void;
    getProductCategory(): ProductCategory | undefined;
    setProductCategory(value?: ProductCategory): Product;
    getProductType(): ProductType;
    setProductType(value: ProductType): Product;
    getIsNowSales(): boolean;
    setIsNowSales(value: boolean): Product;

    hasCoffeeBean(): boolean;
    clearCoffeeBean(): void;
    getCoffeeBean(): CoffeeBean | undefined;
    setCoffeeBean(value?: CoffeeBean): Product;
    clearCoffeeBrewsList(): void;
    getCoffeeBrewsList(): Array<CoffeeBrew>;
    setCoffeeBrewsList(value: Array<CoffeeBrew>): Product;
    addCoffeeBrews(value?: CoffeeBrew, index?: number): CoffeeBrew;
    getAmount(): number;
    setAmount(value: number): Product;

    hasStock(): boolean;
    clearStock(): void;
    getStock(): Stock | undefined;
    setStock(value?: Stock): Product;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Product.AsObject;
    static toObject(includeInstance: boolean, msg: Product): Product.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Product, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Product;
    static deserializeBinaryFromReader(message: Product, reader: jspb.BinaryReader): Product;
}

export namespace Product {
    export type AsObject = {
        productId: string,
        productName: string,
        productCategory?: ProductCategory.AsObject,
        productType: ProductType,
        isNowSales: boolean,
        coffeeBean?: CoffeeBean.AsObject,
        coffeeBrewsList: Array<CoffeeBrew.AsObject>,
        amount: number,
        stock?: Stock.AsObject,
    }
}

export class ProductCategory extends jspb.Message { 
    getId(): string;
    setId(value: string): ProductCategory;
    getName(): string;
    setName(value: string): ProductCategory;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ProductCategory.AsObject;
    static toObject(includeInstance: boolean, msg: ProductCategory): ProductCategory.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ProductCategory, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ProductCategory;
    static deserializeBinaryFromReader(message: ProductCategory, reader: jspb.BinaryReader): ProductCategory;
}

export namespace ProductCategory {
    export type AsObject = {
        id: string,
        name: string,
    }
}

export class CoffeeBean extends jspb.Message { 
    getId(): string;
    setId(value: string): CoffeeBean;
    getName(): string;
    setName(value: string): CoffeeBean;
    getGramQuantity(): number;
    setGramQuantity(value: number): CoffeeBean;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CoffeeBean.AsObject;
    static toObject(includeInstance: boolean, msg: CoffeeBean): CoffeeBean.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CoffeeBean, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CoffeeBean;
    static deserializeBinaryFromReader(message: CoffeeBean, reader: jspb.BinaryReader): CoffeeBean;
}

export namespace CoffeeBean {
    export type AsObject = {
        id: string,
        name: string,
        gramQuantity: number,
    }
}

export class CoffeeBrew extends jspb.Message { 
    getId(): string;
    setId(value: string): CoffeeBrew;
    getName(): string;
    setName(value: string): CoffeeBrew;
    getBeanQuantityGrams(): number;
    setBeanQuantityGrams(value: number): CoffeeBrew;
    getAmount(): number;
    setAmount(value: number): CoffeeBrew;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CoffeeBrew.AsObject;
    static toObject(includeInstance: boolean, msg: CoffeeBrew): CoffeeBrew.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CoffeeBrew, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CoffeeBrew;
    static deserializeBinaryFromReader(message: CoffeeBrew, reader: jspb.BinaryReader): CoffeeBrew;
}

export namespace CoffeeBrew {
    export type AsObject = {
        id: string,
        name: string,
        beanQuantityGrams: number,
        amount: number,
    }
}

export class Stock extends jspb.Message { 
    getId(): string;
    setId(value: string): Stock;
    getName(): string;
    setName(value: string): Stock;
    getQuantity(): number;
    setQuantity(value: number): Stock;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Stock.AsObject;
    static toObject(includeInstance: boolean, msg: Stock): Stock.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Stock, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Stock;
    static deserializeBinaryFromReader(message: Stock, reader: jspb.BinaryReader): Stock;
}

export namespace Stock {
    export type AsObject = {
        id: string,
        name: string,
        quantity: number,
    }
}

export class Order extends jspb.Message { 
    getId(): string;
    setId(value: string): Order;
    clearItemsList(): void;
    getItemsList(): Array<OrderItem>;
    setItemsList(value: Array<OrderItem>): Order;
    addItems(value?: OrderItem, index?: number): OrderItem;
    clearDiscountsList(): void;
    getDiscountsList(): Array<Discount>;
    setDiscountsList(value: Array<Discount>): Order;
    addDiscounts(value?: Discount, index?: number): Discount;

    hasPayment(): boolean;
    clearPayment(): void;
    getPayment(): Payment | undefined;
    setPayment(value?: Payment): Order;
    getPaymentAt(): string;
    setPaymentAt(value: string): Order;
    getOrderAt(): string;
    setOrderAt(value: string): Order;
    getCallNumber(): string;
    setCallNumber(value: string): Order;
    getClientId(): string;
    setClientId(value: string): Order;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Order.AsObject;
    static toObject(includeInstance: boolean, msg: Order): Order.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Order, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Order;
    static deserializeBinaryFromReader(message: Order, reader: jspb.BinaryReader): Order;
}

export namespace Order {
    export type AsObject = {
        id: string,
        itemsList: Array<OrderItem.AsObject>,
        discountsList: Array<Discount.AsObject>,
        payment?: Payment.AsObject,
        paymentAt: string,
        orderAt: string,
        callNumber: string,
        clientId: string,
    }
}

export class OrderItem extends jspb.Message { 
    getProductId(): string;
    setProductId(value: string): OrderItem;
    getQuantity(): string;
    setQuantity(value: string): OrderItem;
    getAmount(): number;
    setAmount(value: number): OrderItem;
    getCoffeeBrewId(): string;
    setCoffeeBrewId(value: string): OrderItem;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): OrderItem.AsObject;
    static toObject(includeInstance: boolean, msg: OrderItem): OrderItem.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: OrderItem, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): OrderItem;
    static deserializeBinaryFromReader(message: OrderItem, reader: jspb.BinaryReader): OrderItem;
}

export namespace OrderItem {
    export type AsObject = {
        productId: string,
        quantity: string,
        amount: number,
        coffeeBrewId: string,
    }
}

export class Discount extends jspb.Message { 
    getId(): string;
    setId(value: string): Discount;
    getType(): Discount.DiscountType;
    setType(value: Discount.DiscountType): Discount;
    getDiscountAmount(): number;
    setDiscountAmount(value: number): Discount;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Discount.AsObject;
    static toObject(includeInstance: boolean, msg: Discount): Discount.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Discount, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Discount;
    static deserializeBinaryFromReader(message: Discount, reader: jspb.BinaryReader): Discount;
}

export namespace Discount {
    export type AsObject = {
        id: string,
        type: Discount.DiscountType,
        discountAmount: number,
    }

    export enum DiscountType {
    PRICE = 0,
    }

}

export class Payment extends jspb.Message { 
    getId(): string;
    setId(value: string): Payment;
    getType(): Payment.PaymentType;
    setType(value: Payment.PaymentType): Payment;
    getReceiveAmount(): number;
    setReceiveAmount(value: number): Payment;
    getPaymentAmount(): number;
    setPaymentAmount(value: number): Payment;
    getChangeAmount(): number;
    setChangeAmount(value: number): Payment;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Payment.AsObject;
    static toObject(includeInstance: boolean, msg: Payment): Payment.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Payment, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Payment;
    static deserializeBinaryFromReader(message: Payment, reader: jspb.BinaryReader): Payment;
}

export namespace Payment {
    export type AsObject = {
        id: string,
        type: Payment.PaymentType,
        receiveAmount: number,
        paymentAmount: number,
        changeAmount: number,
    }

    export enum PaymentType {
    CASH = 0,
    }

}

export enum ProductType {
    COFFEE = 0,
    OTHER = 1,
}
