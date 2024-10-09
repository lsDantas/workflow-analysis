<script>
    export let onClick;
</script>

<div class="restore-button-container">
    <button class="restore-button" on:click={onClick}><slot/></button>
</div>

<style>
    .restore-button-container {
        margin-left: 5px;
        margin-right: 5px;
    }

    .restore-button {
        font-family: "Poppins";
        font-size: 0.95em;
        font-weight: 600;
        color: white;
        background-color: #e8ae00;
        border-style: none;
        border-radius: 10px;
        padding: 10px;
    }

    .restore-button:active {
        background-color: #ba8b00;
    }
</style>