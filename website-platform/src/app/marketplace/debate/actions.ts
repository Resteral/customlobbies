'use server';

import { createClient } from '@/utils/supabase/server';

const POLITICS_TOPICS = [
  "Should AI replace human software developers?",
  "Should college education be free for everyone?",
  "Should social media be banned for children under 16?",
  "Is remote work superior to working in a physical office?",
  "Should carbon emissions be heavily taxed globally?",
  "Is universal basic income (UBI) a viable economic model?"
];

const GAMING_TOPICS = [
  "Is pineapple on pizza delicious or a culinary crime?",
  "Bitcoin vs. Gold: What is the ultimate store of value?",
  "PlayStation 5 vs. Xbox Series X: Which is the superior console?",
  "Are dogs better companions than cats?",
  "Marvel vs. DC: Who has the better superhero universe?",
  "Is coffee better than tea?"
];

export async function findOrCreateDebateRoom(category: 'politics' | 'gaming' = 'gaming') {
  const supabase = await createClient();

  // 1. Look for an active room in the selected category created in the last 5 minutes that has fewer than 2 distinct senders
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  const { data: activeRooms, error: roomsErr } = await supabase
    .from('debate_rooms')
    .select('id, topic')
    .eq('status', 'active')
    .eq('category', category)
    .gt('created_at', fiveMinutesAgo)
    .order('created_at', { ascending: false });

  if (roomsErr) {
    console.error('Error finding rooms:', roomsErr);
  }

  if (activeRooms && activeRooms.length > 0) {
    for (const room of activeRooms) {
      // Count messages in this room to check if there's already 2 debaters
      const { data: messages } = await supabase
        .from('debate_messages')
        .select('sender')
        .eq('room_id', room.id);

      const uniqueSenders = new Set(messages?.map(m => m.sender) || []);
      
      // If there's 1 sender, we can join as User2!
      if (uniqueSenders.size === 1) {
        return { 
          roomId: room.id, 
          topic: room.topic, 
          role: 'User2' // The second joiner is User2
        };
      }
    }
  }

  // 2. If no available room found, create a new one in the category with a random topic!
  const topicList = category === 'politics' ? POLITICS_TOPICS : GAMING_TOPICS;
  const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];
  
  const { data: newRoom, error: createErr } = await supabase
    .from('debate_rooms')
    .insert([{ topic: randomTopic, category, status: 'active' }])
    .select('id, topic')
    .single();

  if (createErr) {
    console.error('Error creating debate room:', createErr);
    return { error: 'Failed to create room' };
  }

  return {
    roomId: newRoom.id,
    topic: newRoom.topic,
    role: 'User1' // The creator is User1
  };
}

export async function sendDebateMessage(roomId: string, sender: string, content: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('debate_messages')
    .insert([
      {
        room_id: roomId,
        sender,
        content
      }
    ]);

  if (error) {
    console.error('Error sending debate message:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function fetchDebateMessages(roomId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('debate_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching debate messages:', error);
    return [];
  }

  return data || [];
}
