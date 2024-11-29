<script lang="ts" setup>
import {isExternal} from "@/utils/validate"

interface Props {
  to: string
}

const props = defineProps<Props>()
</script>

<template>
  <a v-if="isExternal(props.to)" :href="props.to" rel="noopener" target="_blank">
    <slot/>
  </a>
  <router-link v-else :to="props.to">
    <slot/>
  </router-link>
</template>
