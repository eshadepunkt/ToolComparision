<template>
    <div id="CriteriumCard">

    </div>
</template>


<script lang="ts" src="../js/typedefinitions.ts"></script>

<script lang="ts">
enum criteriaModuleState {
    minimized,
    maximized,
    increation,
}

</script>


<script lang="ts">

export default {
    name: "CriteriumCard",
    data: () => ({
        moduleState: criteriaModuleState,
        criterium: criterium,
    })
}
</script>