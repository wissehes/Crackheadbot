<template>
  <div>
    <h3>
      {{ command.name }}
      <Badge v-if="command.ownerOnly" text="owner only" type="warning" />
    </h3>
    <p>
      {{ command.description }}
    </p>
    <details class="custom-block details">
      <p>
        <b>Usage:</b> <code>{{ command.format }}</code>
      </p>

      <div class="examples" v-if="command.examples.length">
        <p><b>Examples:</b></p>
        <ul>
          <li v-for="ex in command.examples" :key="ex">{{ ex }}</li>
        </ul>
      </div>

      <p v-if="command.aliases.length > 0">
        <b>Aliases:</b> {{ command.aliases.join(", ") }}
      </p>
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
<style>
/* Remove ugly margins */
.examples ul {
  margin-top: 0px;
}
.examples p {
  margin-bottom: 0px;
}
</style>