import { ApiProperty } from '@nestjs/swagger';

export class BoxDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  altura: number;

  @ApiProperty()
  largura: number;

  @ApiProperty()
  comprimento: number;
}
