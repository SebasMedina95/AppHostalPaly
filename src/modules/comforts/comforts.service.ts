import { Injectable } from '@nestjs/common';
import { CreateComfortInput } from './dto/create-comfort.input';
import { UpdateComfortInput } from './dto/update-comfort.input';

@Injectable()
export class ComfortsService {
  create(createComfortInput: CreateComfortInput) {
    return 'This action adds a new comfort';
  }

  findAll() {
    return `This action returns all comforts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comfort`;
  }

  update(id: number, updateComfortInput: UpdateComfortInput) {
    return `This action updates a #${id} comfort`;
  }

  remove(id: number) {
    return `This action removes a #${id} comfort`;
  }
}
