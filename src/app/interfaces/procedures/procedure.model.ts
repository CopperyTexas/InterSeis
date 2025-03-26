export interface Procedure<T = any> {
  id: string; // уникальный идентификатор экземпляра процедуры
  type: string; // тип процедуры (для выбора компонента формы)
  name: string; // название для отображения
  parameters: T; // параметры процедуры (тип зависит от конкретной процедуры)
  active?: boolean;
  mode?: 'SP' | 'DP' | 'OP' | 'None';
  groupType?: 'single-channel' | 'multi-channel' | 'header-processing';
}
