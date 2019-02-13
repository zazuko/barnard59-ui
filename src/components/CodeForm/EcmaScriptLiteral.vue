<script>
export default {
  props: [
    'implementation'
  ]
}
</script>
<template>
  <textarea class="form-control" rows="20" v-model="implementation['@value']"></textarea>
</template>
