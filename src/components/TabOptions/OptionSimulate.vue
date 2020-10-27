<template>
  <div>
    <button @click="$emit('click', { type: 'backward', steps: 1 })">
      Voltar passo
    </button>
    <button @click="$emit('click', { type: 'forward', steps: 1 })">
      Avançar passo
    </button>
    <button @click="$emit('click', { type: 'backward', steps: 1 })">
      Voltar simulação
    </button>
    <button @click="$emit('click', { type: 'forward', steps: 1 })">
      Avançar simulação
    </button>
  </div>
</template>

<script>
export default {
  name: "OptionSimulate"
};
</script>

<style scoped>
button {
  padding: 15px;
}
</style>
