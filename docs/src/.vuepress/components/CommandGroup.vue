<template>
  <div>
    <div v-if="!loading">
      <Command
        v-for="command in commands"
        :key="command.name"
        :command="command"
      />
    </div>
    <div v-else>
      <p>
        <b> Loading... </b>
      </p>
    </div>
    <span v-if="error" class="error">
      An error occurred while fetching the commands list!
    </span>
  </div>
</template>

<script>
import Command from "./Command";

export default {
  data: () => ({
    loading: true,
    error: false,
    commands: [],
  }),
  props: ["group"],
  components: {
    Command,
  },
  mounted() {
    fetch(`https://crackheadbot.wissehes.nl/api/commands/group/${this.group}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else throw new Error(response);
      })
      .then((commands) => {
        this.loading = false;
        this.commands = commands;

        this.commands = commands;
      })
      .catch((a) => (this.error = true));
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
