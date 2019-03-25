<script>
import FormGroup from 'bootstrap-vue/es/components/form-group/form-group'
import Form from 'bootstrap-vue/es/components/form/form'
import FormInput from 'bootstrap-vue/es/components/form-input/form-input'
import Button from 'bootstrap-vue/es/components/button/button'
import Table from 'bootstrap-vue/es/components/table/table'
import Select from 'bootstrap-vue/es/components/form-select/form-select'
import { createNamespacedHelpers } from 'vuex'
import Vue from 'vue'
import BFormSelect from 'bootstrap-vue/src/components/form-select/form-select'

const { mapGetters } = createNamespacedHelpers('pipeline')

const types = {
  'p:variableName': {
    text: 'Variable'
  },
  'code:EcmaScriptTemplateLiteral': {
    text: 'ES6 template literal'
  },
  'code:EcmaScript': {
    text: 'EcmaScript'
  },
  'Pipeline': {
    text: 'Pipeline',
    resource: true
  }
}

function mapArgument (arg) {
  if (arg.id) {
    return {
      type: 'Pipeline',
      value: arg.id
    }
  }

  return {
    type: arg['@type'],
    value: arg['@value']
  }
}

export default {
  props: [
    'step'
  ],
  components: {
    BFormSelect,
    'b-table': Table,
    'b-select': Select,
    'b-button': Button,
    'b-form': Form,
    'b-form-input': FormInput,
    'b-form-group': FormGroup
  },
  data: (props) => {
    return {
      types,
      fields: ['index', 'value', 'actions'],
      editedFields: [],
      stepArguments: props.step['code:arguments'].map(a => ({ ...a }))
    }
  },
  computed: {
    ...mapGetters({
      pipelines: 'pipelines'
    }),
    items () {
      if (!this.stepArguments) {
        return []
      }

      return this.stepArguments.map((arg, index) => ({
        index: index + 1,
        ...arg,
        _showDetails: !!this.editedFields[index]
      }))
    },
    pipelineOptions () {
      return this.pipelines.map(p => ({
        value: p.id,
        text: p.id
      }))
    }
  },
  watch: {
    step () {
      if (!this.step['code:arguments']) {
        this.stepArguments = []
        return
      }

      this.stepArguments = this.step['code:arguments'].map(a => ({ ...a }))
    }
  },
  methods: {
    saveArgument (evt, row) {
      let newArgument

      if (this.editedFields[row.index].type === 'Pipeline') {
        newArgument = {
          id: this.editedFields[row.index].value
        }
      } else {
        newArgument = {
          '@value': this.editedFields[row.index].value,
          '@type': this.editedFields[row.index].type
        }
      }

      Vue.set(this.stepArguments, row.index, newArgument)

      this.endEditing(evt, row.index)
    },
    revertArgument (evt, row) {
      this.endEditing(evt, row.index)
    },
    addArgument () {
      this.stepArguments.push({})
      this.editArgument(this.stepArguments.length - 1)
    },
    editArgument (index) {
      if (!this.editedFields[index]) {
        Vue.set(this.editedFields, index, mapArgument(this.items[index]))
      }
    },
    endEditing (evt, index) {
      this.editedFields.splice(this.editedFields.indexOf(index), 1)
      evt.preventDefault()
    },
    removeArgument (index) {
      this.stepArguments.splice(index, 1)
      this.editedFields.splice(index, 1)
    },
    getLabel (argument) {
      if (argument.id) {
        return `<${argument.id}>`
      }

      if (argument['@value'] && argument['@type']) {
        return `"${argument['@value']}"^^${argument['@type']}`
      }

      return ''
    }
  }
}
</script>

<template>
  <div>
    <b-table :items="items" :fields="fields">
      <template slot="value" slot-scope="data">
        {{ getLabel(data.item) }}
      </template>

      <template slot="actions" slot-scope="row">
        <b-button @click.stop="editArgument(row.index)">Edit</b-button>
        <b-button @click.stop="removeArgument(row.index)" variant="danger">Delete</b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-form @submit.stop="saveArgument($event, row)">
          <b-form-group label="Type" label-for="type">
            <b-select id="type" :options="types" v-model="editedFields[row.index].type"></b-select>
          </b-form-group>
          <b-form-group label="Value" label-for="value">
            <template v-if="editedFields[row.index].type === 'Pipeline'">
              <b-form-select v-model="editedFields[row.index].value" :options="pipelineOptions"></b-form-select>
            </template>
            <template v-else>
              <b-form-input id="value" v-model="editedFields[row.index].value"></b-form-input>
            </template>
          </b-form-group>
          <b-button type="submit" variant="primary">Save</b-button>
          <b-button @click="revertArgument($event, row)" variant="secondary">Cancel</b-button>
        </b-form>
      </template>
    </b-table>

    <b-button variant="primary" @click="addArgument">Add</b-button>
  </div>
</template>
