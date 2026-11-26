import { supabase } from './supabase';

export interface MpRoom {
  id: string;
  code: string;
  kind: 'private' | 'public';
  status: 'waiting' | 'countdown' | 'playing' | 'finished' | 'abandoned';
  total_questions: number;
  quote_ids: number[];
  started_at: string | null;
  rematch_requested_by: string | null;
  next_room_id: string | null;
}

export interface MpPlayer {
  id: string;
  nickname: string;
  slot: 1 | 2;
  score: number;
  lives: number;
  streak: number;
  best_streak: number;
  elapsed_ms: number;
  status: 'lobby' | 'playing' | 'won' | 'lost' | 'disconnected' | 'left';
  started_at: string | null;
  finished_at: string | null;
}

export interface MpState {
  room: MpRoom;
  me: MpPlayer;
  opponent: MpPlayer | null;
}

interface CreateResult {
  room_id: string;
  player_id: string;
  code: string;
  slot: 1 | 2;
}

export interface MpSession {
  playerId: string;
  roomId: string;
  code: string;
  slot: 1 | 2;
  nickname: string;
  mode: 'private-host' | 'private-guest' | 'public';
}

export async function createRoom(nickname: string, kind: 'private' | 'public'): Promise<CreateResult> {
  const { data, error } = await supabase.rpc('mp_create_room', {
    p_nickname: nickname,
    p_kind: kind,
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as CreateResult;
}

export async function joinRoom(code: string, nickname: string): Promise<CreateResult> {
  const { data, error } = await supabase.rpc('mp_join_room', {
    p_code: code,
    p_nickname: nickname,
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as CreateResult;
}

export async function joinPublic(nickname: string): Promise<CreateResult> {
  const { data, error } = await supabase.rpc('mp_join_public', { p_nickname: nickname });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as CreateResult;
}

export async function leaveRoom(playerId: string): Promise<void> {
  await supabase.rpc('mp_leave_room', { p_player_id: playerId });
}

export async function heartbeat(playerId: string): Promise<void> {
  await supabase.rpc('mp_heartbeat', { p_player_id: playerId });
}

export async function getState(playerId: string): Promise<MpState> {
  const { data, error } = await supabase.rpc('mp_get_state', { p_player_id: playerId });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data as MpState;
}

export interface QuoteIndexEntry {
  quote_id: number;
  author_name: string;
  decoy_name: string;
  correct_side: 'left' | 'right';
}

export interface StartRoomResult {
  ok: boolean;
  total_questions?: number;
  error?: string;
}

export async function startRoom(
  playerId: string,
  quoteIds: number[],
  index: QuoteIndexEntry[]
): Promise<StartRoomResult> {
  const { data, error } = await supabase.rpc('mp_start_room', {
    p_player_id: playerId,
    p_quote_ids: quoteIds,
    p_index: index,
  });
  if (error) throw new Error(error.message);
  return data as StartRoomResult;
}

export async function beginPlay(playerId: string): Promise<void> {
  await supabase.rpc('mp_begin_play', { p_player_id: playerId });
}

export interface SubmitAnswerResult {
  is_correct: boolean;
  correct_side: 'left' | 'right';
  score: number;
  lives: number;
  finished: boolean;
  error?: string;
}

export async function submitAnswer(
  playerId: string,
  quoteId: number,
  selectedSide: 'left' | 'right'
): Promise<SubmitAnswerResult> {
  const { data, error } = await supabase.rpc('mp_submit_answer', {
    p_player_id: playerId,
    p_quote_id: quoteId,
    p_selected_side: selectedSide,
  });
  if (error) throw new Error(error.message);
  return data as SubmitAnswerResult;
}

export interface MpResult {
  outcome: 'won' | 'lost' | 'draw';
  me: MpPlayer;
  opponent: MpPlayer;
}

export function computeOutcome(me: MpPlayer, opponent: MpPlayer): 'won' | 'lost' | 'draw' {
  // 1. More correct answers (score) wins.
  if (me.score > opponent.score) return 'won';
  if (me.score < opponent.score) return 'lost';
  // 2. More lives remaining wins.
  if (me.lives > opponent.lives) return 'won';
  if (me.lives < opponent.lives) return 'lost';
  // 3. Less total time wins.
  if (me.elapsed_ms < opponent.elapsed_ms) return 'won';
  if (me.elapsed_ms > opponent.elapsed_ms) return 'lost';
  return 'draw';
}

export async function getRoomByCode(code: string): Promise<{ status: string; playerCount: number } | null> {
  const { data, error } = await supabase
    .from('mp_rooms')
    .select('id, code, status')
    .eq('code', code.toUpperCase())
    .maybeSingle();
  if (error || !data) return null;
  const { count } = await supabase
    .from('mp_players')
    .select('id', { count: 'exact', head: true })
    .eq('room_id', data.id)
    .neq('status', 'left');
  return { status: data.status, playerCount: count ?? 0 };
}

export function buildInviteLink(code: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/#join=${code}`;
}

export function parseJoinCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const match = hash.match(/join=([A-Z0-9]+)/i);
  return match ? match[1].toUpperCase() : null;
}

export function clearJoinCodeFromUrl(): void {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash.replace(/join=[A-Z0-9]+/i, '');
  const cleaned = hash.replace(/^#\/?$/, '');
  if (cleaned === '' || cleaned === '#') {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  } else {
    history.replaceState(null, '', window.location.pathname + window.location.search + cleaned);
  }
}
