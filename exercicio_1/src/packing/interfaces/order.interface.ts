import { ApiProperty } from '@nestjs/swagger';

export class ProductSizeDto {
  @ApiProperty()
  altura: number;

  @ApiProperty()
  largura: number;

  @ApiProperty()
  comprimento: number;
}

export class ProductDto {
  @ApiProperty()
  produto_id: string;

  @ApiProperty({ type: ProductSizeDto })
  dimensoes: ProductSizeDto;
}

export class OrderDto {
  @ApiProperty()
  pedido_id: number;

  @ApiProperty({ type: [ProductDto] })
  produtos: ProductDto[];
}

export class PackedProductDto {
  @ApiProperty({ nullable: true })
  caixa_id: string | null;

  @ApiProperty({ type: [String] })
  produtos: string[];

  @ApiProperty({ required: false })
  observacao?: string;
}

export class PackedOrderDto {
  @ApiProperty()
  pedido_id: number;

  @ApiProperty({ type: [PackedProductDto] })
  caixas: PackedProductDto[];
}
