import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicTableService {
  private columnConfigSource = new BehaviorSubject<
    { key: string; label: string; visible: boolean; fixed: boolean }[]
  >([]);

  columnConfig$ = this.columnConfigSource.asObservable();

  setColumnConfig(config: { key: string; label: string; visible: boolean; fixed: boolean }[]) {
    this.columnConfigSource.next(config);
  }

  toggleColumnVisibility(key: string) {
    const currentConfig = this.columnConfigSource.value;
    const updatedConfig = currentConfig.map((col) =>
      col.key === key && !col.fixed ? { ...col, visible: !col.visible } : col
    );
    this.columnConfigSource.next(updatedConfig);
  }
}
