import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { PackingService } from './pack.service';
import { OrderDto, PackedOrderDto } from './interfaces/order.interface';

@ApiTags('packing')
@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  @Post()
  @ApiOperation({ summary: 'Processar pedidos e calcular empacotamento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Pedidos processados com sucesso',
    type: [PackedOrderDto]
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Formato de entrada inválido' 
  })
  @ApiBody({
    description: 'Lista de pedidos com produtos para empacotar',
    type: [OrderDto], 
    examples: {
      example1: {
        summary: 'Exemplo de entrada',
        value: {
          pedidos: [
            {
              pedido_id: 1,
              produtos: [
                {"produto_id": "PS5", "dimensoes": {"altura": 40, "largura": 10, "comprimento": 25}},
                {"produto_id": "Volante", "dimensoes": {"altura": 40, "largura": 30, "comprimento": 30}}
              ]
            }
          ]
        }
      }
    }
  })
  async packOrders(@Body() body: { pedidos: OrderDto[] }): Promise<{ pedidos: PackedOrderDto[] }> {
    try {
      if (!body.pedidos || !Array.isArray(body.pedidos)) {
        throw new HttpException('Formato de entrada inválido', HttpStatus.BAD_REQUEST);
      }

      const result = this.packingService.processOrders({orders: body.pedidos});
      return { pedidos: result };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro interno do servidor',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}