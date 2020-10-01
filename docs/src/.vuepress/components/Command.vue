<template>
  <div>
    <h2>{{ command.name }}</h2>
    <p>{{ command.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    command: Object,
  },
};
</script>