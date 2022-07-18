/**
 * 分页数据封装
 */
export class Page<T> {
  total: number;
  pageNo: number;
  pageSize: number;
  records: T[];
  static build<T>(records: T[], total: number, pageNo: number, pageSize: number): Page<T> {
    const page = new Page<T>();
    page.records = records;
    page.total = total;
    page.pageNo = pageNo;
    page.pageSize = pageSize;
    return page;
  }
}
