import { Injectable } from '@nestjs/common';
import { CreateIndicatorBoardMetadataPort } from '../../../application/port/persistence/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

import { IndicatorBoardMetadataEntity } from './entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadataMapper } from './mapper/indicator-board-metadata.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../../../../auth/auth.service';

@Injectable()
export class IndicatorBoardMetadataPersistentAdapter implements CreateIndicatorBoardMetadataPort {
  constructor(
    @InjectRepository(IndicatorBoardMetadataEntity)
    private readonly indicatorBoardMetadataRepository: Repository<IndicatorBoardMetadataEntity>,
    private readonly authService: AuthService,
  ) {}

  async createIndicatorBoardMetaData(
    indicatorBoardMetaData: IndicatorBoardMetadata,
    memberId: number,
  ): Promise<string> {
    const member = await this.authService.findById(memberId);

    const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = IndicatorBoardMetadataMapper.mapDomainToEntity(
      indicatorBoardMetaData,
      member,
    );
    await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
    return indicatorBoardMetaDataEntity.id;
  }

  async findOneBy(id: string) {
    return this.indicatorBoardMetadataRepository.findOneBy({ id });
  }
}