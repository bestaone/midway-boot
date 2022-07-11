import { BaseService } from './BaseService';
import { BaseEntity } from './BaseEntity';
import { Body, Post, Query } from '@midwayjs/decorator';
import { Assert } from './Assert';
import { ErrorCode } from './ErrorCode';
import { ApiResponse } from '@midwayjs/swagger';
import { Page } from './Page';

/**
 * Controller基础类，由于类继承不支持装饰类@Post、@Query、@Body等，
 * 所以这里的装饰类不生效，否则实现类就不需要再写多余代码了，
 * 这里保留在这里，以备以后可能会支持继承的装饰类
 */
export abstract class BaseController<T extends BaseEntity> {
  abstract getService(): BaseService<T>;

  @Post('/create')
  async create(@Body() body: T): Promise<T> {
    Assert.notNull(!body.id, ErrorCode.UN_ERROR, '创建对象时ID必须为空');
    return this.getService().save(body);
  }

  @Post('/delete')
  async delete(@Query('id') id: number): Promise<boolean> {
    await this.getService().delete(id);
    return true;
  }

  @Post('/update')
  async update(@Body() body: T): Promise<T> {
    Assert.notNull(body.id, ErrorCode.UN_ERROR, '更新对象时ID不能为空');
    return this.getService().save(body);
  }

  @Post('/findById')
  async findById(@Query('id') id: number): Promise<T> {
    return this.getService().findById(id);
  }

  @ApiResponse({ description: '通过一批主键查找' })
  @Post('/findByIds')
  async findByIds(@Query('ids') ids: number[]): Promise<T[]> {
    return this.getService().findByIds(ids);
  }

  @ApiResponse({ description: '分页查询' })
  @Post('/page')
  async page(@Body() map: Map<string, any>): Promise<Page<T>> {
    const pageNo = map.get('pageNo');
    const pageSize = map.get('pageSize');
    Assert.notNull(pageNo != null && pageNo > 0, ErrorCode.UN_ERROR, 'pageNo不能为空');
    Assert.notNull(pageSize != null && pageSize > 0, ErrorCode.UN_ERROR, 'pageSize不能为空');
    map.delete('pageNo');
    map.delete('pageSize');
    const o = {};
    map.forEach((value, key) => (o[key] = value));
    return this.getService().page(o, pageNo, pageSize);
  }

  @Post('/limit')
  async limit(@Body() map: Map<string, any>) {
    const offset = map.get('offset');
    const limit = map.get('limit');
    Assert.notNull(offset != null && offset > 0, ErrorCode.UN_ERROR, 'offset不能为空');
    Assert.notNull(limit != null && limit > 0, ErrorCode.UN_ERROR, 'limit不能为空');
    map.delete('offset');
    map.delete('limit');
    const o = {};
    map.forEach((value, key) => (o[key] = value));
    return this.getService().limit(o, offset, limit);
  }

  @Post('/findOne')
  async findOne(@Body() body: T): Promise<T> {
    Assert.notNull(!body.id, ErrorCode.UN_ERROR, '不能使用ID查询');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getService().findOne({ ...body });
  }
}
