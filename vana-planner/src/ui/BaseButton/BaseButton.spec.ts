import { render } from '@testing-library/vue'
import BaseButton from './BaseButton.vue'

test('async muestra el label', async () => {
  const { getByText } = render(BaseButton, { props: { label: 'Guardar' } })
  getByText('Guardar')
})
