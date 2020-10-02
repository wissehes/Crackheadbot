<template>
  <div>
    <h3>
      {{ command.name }}
      <Badge v-if="command.ownerOnly" text="owner only" type="warning" />
    </h3>
    <p>
      {{ command.description }}
    </p>
    <details class="custom-block details" v-if="command.aliases.length > 0">
      <p><b>Aliases:</b> {{ command.aliases.join(", ") }}</p>
    </details>
    <hr />
  </div>
</template>

<script>
export default {
  props: {
    command: Object,
  },
};
</script>