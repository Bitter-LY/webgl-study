import { NRadioButton, NRadioGroup } from 'naive-ui'
import { defineComponent, type PropType } from 'vue'
import './index.scss'

export type RadioControllerConfig = {
  value: string | number
  onChange: (v: string | number) => void
  children: Array<{
    label: string
    value: string | number
  }>
}

export default defineComponent({
  name: 'RadioController',
  props: {
    config: {
      type: Object as PropType<RadioControllerConfig>,
      required: true
    }
  },
  render() {
    return (
      <div id="RadioController">
        <NRadioGroup
          size="small"
          value={this.config.value}
          onUpdateValue={this.config.onChange}
        >
          {this.config.children.map((e) => (
            <NRadioButton
              value={e.value}
              label={e.label}
            />
          ))}
        </NRadioGroup>
      </div>
    )
  }
})
