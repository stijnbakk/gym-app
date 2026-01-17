<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<svelte:head>
	<title>Profile</title>
</svelte:head>

<div class="profile-container">
	<div class="profile-card">
		<h1>Profile</h1>

		<div class="user-info">
			<div class="info-row">
				<span class="label">Email</span>
				<span class="value">{data.user.email}</span>
			</div>

			{#if data.user.username}
				<div class="info-row">
					<span class="label">Username</span>
					<span class="value">{data.user.username}</span>
				</div>
			{/if}

			<div class="info-row">
				<span class="label">Verified</span>
				<span class="value">{data.user.verified ? 'Yes' : 'No'}</span>
			</div>

			<div class="info-row">
				<span class="label">Member since</span>
				<span class="value">{new Date(data.user.created).toLocaleDateString()}</span>
			</div>
		</div>

		<form method="POST" action="?/logout" use:enhance>
			<button type="submit">Logout</button>
		</form>
	</div>
</div>

<style>
	.profile-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}

	.profile-card {
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

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid #eee;
	}

	.label {
		font-weight: 500;
		color: #666;
	}

	.value {
		color: #333;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background: #dc3545;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
	}

	button:hover {
		background: #c82333;
	}
</style>
