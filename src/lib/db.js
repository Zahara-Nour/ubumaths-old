import { supabaseClient } from '$lib/supabase'
import { connected } from '$lib/sessionStore'
import { get } from 'svelte/store'
import { getLogger } from '$lib/utils'
let { info, fail, warn } = getLogger('DB', 'info')

export async function selectDB({
	table,
	columns = ['*'],
	eqs = [],
	single = false,
}) {

	if (get(connected)) {
		const user = supabaseClient.auth.user()
		let request = supabaseClient.from(table).select(...columns)
		eqs.forEach((eq) => {
			request = request.eq(...eq)
		})
		request = request.eq('user_id', user.id)
		if (single) {
			request = request.maybeSingle()
		}

		try {
			const { data, error } = await request
			if (error) throw error
			return data
		} catch (err) {
			fail('Error while select database : ', err)
			return null
		}
	} else {
		return null
	}
}

export async function insertDB({ table, rows }) {
	if (get(connected)) {
		let request = supabaseClient.from(table).insert(rows)
		// request = request.eq('user_id', user.id)

		try {
			const { data, error } = await request
			console.log('data', data)
			if (error) throw error
			return rows.length === 1 ? data[0] : data
		} catch (err) {
			fail('Error while insert database : ', err)
			return null
		}
	} else {
		return null
	}
}

export async function updateDB({
	table,
	columns, // it's an object
	eqs = [],
}) {

	if (get(connected)) {
		const user = supabaseClient.auth.user()
		let request = supabaseClient.from(table).update(columns)
		eqs.forEach((eq) => {
			request = request.eq(...eq)
		})
		request = request.eq('user_id', user.id)
		

		try {
			const { data, error } = await request
			console.log('update data', data)
			console.log('update error', error)
			if (error) throw error
			return data
		} catch (err) {
			fail('Error while update database : ', err)
			return null
		}
	} else {
		return null
	}
}
