<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();

	let showRegister = $state(false);
</script>

<svelte:head>
	<title>{showRegister ? 'Register' : 'Login'}</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<h1>{showRegister ? 'Create Account' : 'Login'}</h1>

		{#if form?.error}
			<div class="error">{form.error}</div>
		{/if}

		<form method="post" use:enhance>
			<label>
				Email
				<input type="email" name="email" required autocomplete="email" />
			</label>

			<label>
				Password
				<input type="password" name="password" required autocomplete="current-password" />
			</label>

			{#if showRegister}
				<label>
					Confirm Password
					<input type="password" name="passwordConfirm" required autocomplete="new-password" />
				</label>
			{/if}

			<div class="buttons">
				{#if showRegister}
					<button type="submit" formaction="?/register">Register</button>
				{:else}
					<button type="submit" formaction="?/login">Login</button>
				{/if}
			</div>
		</form>

		<p class="switch-mode">
			{#if showRegister}
				Already have an account?
				<button type="button" onclick={() => (showRegister = false)}>Login</button>
			{:else}
				Don't have an account?
				<button type="button" onclick={() => (showRegister = true)}>Register</button>
			{/if}
		</p>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.auth-card {
		width: 100%;
		max-width: 400px;
		padding: 2rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		background: #fff;
	}

	h1 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		text-align: center;
	}

	.error {
		padding: 0.75rem;
		margin-bottom: 1rem;
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 4px;
		color: #c00;
		font-size: 0.875rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	input {
		padding: 0.625rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		border-color: #666;
	}

	.buttons {
		margin-top: 0.5rem;
	}

	.buttons button {
		width: 100%;
		padding: 0.75rem;
		background: #333;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	.buttons button:hover {
		background: #444;
	}

	.switch-mode {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		color: #666;
	}

	.switch-mode button {
		background: none;
		border: none;
		color: #333;
		text-decoration: underline;
		cursor: pointer;
		font-size: inherit;
	}
</style>
