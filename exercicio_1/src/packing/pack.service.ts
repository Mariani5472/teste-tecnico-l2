import { Injectable } from "@nestjs/common";
import { BoxDto } from "./interfaces/box.interface";
import { OrderDto, PackedOrderDto, PackedProductDto, ProductDto, ProductSizeDto } from "./interfaces/order.interface";


@Injectable()
export class PackingService {
    private readonly availableBoxes: BoxDto[] = [
        { id: 'Caixa 1', altura: 30, largura: 40, comprimento: 80 },
        { id: 'Caixa 2', altura: 50, largura: 50, comprimento: 40 },
        { id: 'Caixa 3', altura: 50, largura: 80, comprimento: 60 },
    ];

    private productFitsInBox({ productSize, box }: { productSize: ProductSizeDto, box: BoxDto }): boolean {
        const productDimensions = [
            productSize.altura,
            productSize.largura,
            productSize.comprimento,
        ].sort((a, b) => a - b);

        const boxDimensions = [
            box.altura,
            box.largura,
            box.comprimento,
        ].sort((a, b) => a - b);

        return productDimensions.every((dimension, i) => dimension <= boxDimensions[i]);
    }

    private findSuitableBox({ products }: { products: ProductDto[] }): string | null {
        const totalVolume = products.reduce((sum, product) => {
            return sum + (product.dimensoes.altura * product.dimensoes.largura * product.dimensoes.comprimento);
        }, 0);

        const maxDimensions = {
            altura: Math.max(...products.map(p => p.dimensoes.altura)),
            largura: Math.max(...products.map(p => p.dimensoes.largura)),
            comprimento: Math.max(...products.map(p => p.dimensoes.comprimento)),
        };

        for (const box of this.availableBoxes) {
            const boxVolume = box.altura * box.largura * box.comprimento;

            if (totalVolume > boxVolume) continue;

            if (maxDimensions.altura <= box.altura &&
                maxDimensions.largura <= box.largura &&
                maxDimensions.comprimento <= box.comprimento) {
                return box.id;
            }
        }

        return null;
    }

    packOrder({ order }: { order: OrderDto }): PackedOrderDto {
        const packedProducts: PackedProductDto[] = [];
        const productsToPack = [...order.produtos];

        while (productsToPack.length > 0) {
            const currentProducts = [productsToPack[0]];
            let suitableBox = this.findSuitableBox({ products: currentProducts });

            if (suitableBox) {
                productsToPack.shift();

                for (let i = 0; i < productsToPack.length; i++) {
                    const testProducts = [...currentProducts, productsToPack[i]];
                    const testBox = this.findSuitableBox({ products: testProducts });

                    if (testBox === suitableBox) {
                        currentProducts.push(productsToPack[i]);
                        productsToPack.splice(i, 1);
                        i--;
                    }
                }

                packedProducts.push({
                    caixa_id: suitableBox,
                    produtos: currentProducts.map(p => p.produto_id),
                });
            } else {
                const unpackedProduct = productsToPack.shift();
                packedProducts.push({
                    caixa_id: null,
                    produtos: [unpackedProduct!.produto_id],
                    observacao: 'Produto não cabe em nenhuma caixa disponível.',
                });
            }
        }

        return {
            pedido_id: order.pedido_id,
            caixas: packedProducts,
        };
    }

    processOrders({ orders }: { orders: OrderDto[] }): PackedOrderDto[] {
        return orders.map(order => this.packOrder({ order: order }));
    }

}