import { render, fireEvent } from '@testing-library/vue'
import BaseInputText from './BaseInputText.vue'
import { ref } from 'vue'

test('async v-model actualiza', async () => {
  const value = ref('Hola')
  const { getByDisplayValue } = render(BaseInputText, {
    props: { label: 'Nombre', modelValue: value.value },
    attrs: { 'onUpdate:modelValue': (v: string) => (value.value = v) },
  })
  await fireEvent.update(getByDisplayValue('Hola'), 'Nuevo')
  expect(value.value).toBe('Nuevo')
})
