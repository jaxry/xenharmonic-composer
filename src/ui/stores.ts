import { writable } from 'svelte/store'
import Composition from '../composition/Composition'

export const composition = writable(new Composition())