import { OperatorFunction } from 'rxjs';
import { select } from '../core/operators';
import { isString, isUndefined } from '../core/utils';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
} from './entity.state';

interface Options extends BaseEntityOptions<any> {
  pluck?: string | ((entity: unknown) => any);
}

/**
 * Select entity from the store
 *
 * store.pipe(selectEntity(id, { pluck: 'title' })
 *
 */
export function selectEntity<
  S extends EntitiesState<Ref>,
  K extends keyof getEntityType<S, Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,
  options: { pluck: K } & BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[K] | undefined>;

/**
 * Select entity from the store
 *
 * store.pipe(selectEntity(id, { pluck: e => e.title })
 *
 */
export function selectEntity<
  S extends EntitiesState<Ref>,
  R,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,
  options: {
    pluck: (entity: getEntityType<S, Ref>) => R;
  } & BaseEntityOptions<Ref>
): OperatorFunction<S, R | undefined>;

/**
 *
 * Select entity from the store
 *
 * store.pipe(selectEntity(id)
 *
 */
export function selectEntity<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,
  options?: BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref> | undefined>;

export function selectEntity<S extends EntitiesState<Ref>, Ref>(
  id: any,
  options: Options = {}
) {
  const { ref: { entitiesKey } = defaultEntitiesRef, pluck } = options;

  return select<S, Ref>((state) => getEntity(state[entitiesKey], id, pluck));
}

export function getEntity(
  entities: EntitiesRecord,
  id: string | number,
  pluck: Options['pluck']
) {
  const entity = entities[id];

  if (isUndefined(entity)) {
    return undefined;
  }

  if (!pluck) {
    return entity;
  }

  if (isString(pluck)) {
    return entity[pluck];
  }

  return pluck(entity);
}
