import { ref, reactive, watchEffect, onUnmounted } from 'vue'
import {
  defineQuery,
  getComponentValue,
  Has,
  isComponentUpdate,
} from "@dojoengine/recs";

export function useEntityQuery(fragments) {
  const stableFragments = ref(fragments)

  const query = reactive(defineQuery(stableFragments.value, {
    runOnInit: true
  }))

  const entitiesRef = ref([])

  const setEntities = (entities) => {
    entitiesRef.value = [...entities]
  }

  const subscription = query.update$.subscribe(() => {
    setEntities([...query.matching])
  })

  watchEffect(() => {
    setEntities([...query.matching])
  })

  // onUnmounted(() => {
  //   subscription.unsubscribe()
  // })

  return entitiesRef
}

export function useComponentValue(
  component,
  entity,
  defaultValue
) {
  const value = ref(
    entity != null ? getComponentValue(component, entity) : undefined
  )
  value.value = entity != null ? getComponentValue(component, entity) : undefined
  if (entity == null) return;
  const queryResult = defineQuery([Has(component)], { runOnInit: false });
  const subscription = queryResult.update$.subscribe((update) => {
    console.log(update, update.entity, entity, update.entity === entity)
    if (
      isComponentUpdate(update, component) &&
      update.entity === entity
    ) {
      const [nextValue] = update.value;
      value.value = nextValue
    }
  });


  onUnmounted(() => {
    subscription.unsubscribe()
  })

  return value ?? defaultValue;
}
