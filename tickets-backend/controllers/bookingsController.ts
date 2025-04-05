import { Request, Response } from 'express';
import {supabase} from '../db/db';

import { Booking, Ticket } from '../types/types'; 


export const getBookings = async (
  req: Request,
  res: Response<BookingWithTickets[] | { error: string }>
): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        user_id,
        seance_id,
        date_reservation,
        tickets(*)
      `);

    if (error) {
      res.status(500).json({ error: error.message});
      return;
    }

    if (!data) {
      res.json([]);
      return;
    }

    const results = data.map((row: any) => {
      return {
        id: row.id,
        user_id: row.user_id,
        seance_id: row.seance_id,
        date_reservation: row.date_reservation,
        tickets: row.tickets || [],
      } as BookingWithTickets;
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};


export const getBookingById = async (
  req: Request,
  res: Response<BookingWithTickets | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        id,
        user_id,
        seance_id,
        date_reservation,
        tickets(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {  // 'JSON object requested, multiple (or no) rows returned'
        res.status(404).json({ error: 'Booking not found' });
      } else {
        res.status(400).json({ error: error.message });
      }
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    const result = {
      id: data.id,
      user_id: data.user_id,
      seance_id: data.seance_id,
      date_reservation: data.date_reservation,
      tickets: data.tickets || [],
    } as BookingWithTickets;

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching booking with tickets' });
  }
};


interface BookingWithTickets extends Booking{
  tickets: Ticket[]
}


export const createBooking = async (
  req: Request<{}, {}, BookingWithTickets>,
  res: Response<Booking & { tickets: Ticket[] } | { error: string }>
): Promise<void> => {
  try {
    const { user_id, seance_id, date_reservation, tickets } = req.body;

    if (!user_id || !seance_id || !date_reservation || !tickets) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!Array.isArray(tickets) || tickets.length === 0) {
      res.status(400).json({ error: 'No tickets provided' });
      return;
    }


    const { data: bookingData, error: bookingError } = await supabase
      .from('reservations')
      .insert([
        {
          user_id,
          seance_id,
          date_reservation,
        },
      ])
      .select()
      .single(); 

    if (bookingError) {
      res.status(400).json({ error: bookingError.message });
      return;
    }
    if (!bookingData) {
      res.status(400).json({ error: 'Failed to create booking (no data returned)' });
      return;
    }


    const reservationId = bookingData.id;

    const ticketPayload = tickets.map((t) => ({
      reservation_id: reservationId,
      type: t.type,
      num_siege: t.num_siege,
      price: t.price,
    }));

    const { data: ticketRows, error: ticketError } = await supabase
      .from('tickets')
      .insert(ticketPayload)
      .select();

    if (ticketError) {

      await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      res.status(400).json({ error: ticketError.message });
      return;
    }
    if (!ticketRows) {
      await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      res.status(400).json({ error: 'Failed to create tickets (no data returned)' });
      return;
    }

    res.status(201).json({
      ...bookingData,
      tickets: ticketRows,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create booking with tickets' });
  }
};


export const updateBooking = async (
  req: Request<{ id: string }, {}, BookingWithTickets>,
  res: Response<Booking & { tickets: Ticket[] } | { error: string }>
): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, seance_id, date_reservation, tickets } = req.body;

    const { data: existingBooking, error: existingError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (existingError) {
      res.status(400).json({ error: existingError.message });
      return;
    }
    if (!existingBooking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }


    const updateFields: Record<string, any> = {};
    if (user_id !== undefined) updateFields.user_id = user_id;
    if (seance_id !== undefined) updateFields.seance_id = seance_id;
    if (date_reservation !== undefined) updateFields.date_reservation = date_reservation;

    let updatedBooking = existingBooking;

 
    if (Object.keys(updateFields).length > 0) {
      const { data: bookingData, error: bookingError } = await supabase
        .from('reservations')
        .update(updateFields)
        .eq('id', id)
        .select()
        .single();

      if (bookingError) {
        res.status(400).json({ error: bookingError.message });
        return;
      }
      updatedBooking = bookingData; 
    }

   
    let newTickets: Ticket[] = [];
    if (tickets !== undefined) {
      
      const reservationIdNum = Number(id);

      const { error: deleteError } = await supabase
        .from('tickets')
        .delete()
        .eq('reservation_id', reservationIdNum);

      if (deleteError) {
        res.status(400).json({ error: deleteError.message });
        return;
      }


      const ticketPayload = tickets.map((t:any) => ({
        reservation_id: reservationIdNum,
        type: t.type,
        num_siege: t.num_siege,
        price: t.price,
      }));

      const { data: insertedTickets, error: insertError } = await supabase
        .from('tickets')
        .insert(ticketPayload)
        .select();

      if (insertError) {
        res.status(400).json({ error: insertError.message });
        return;
      }

      newTickets = insertedTickets as Ticket[];
    } else {

      const { data: existingTickets, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .eq('reservation_id', id);

      if (ticketsError) {
        res.status(400).json({ error: ticketsError.message });
        return;
      }
      newTickets = (existingTickets || []) as Ticket[];
    }


    res.json({
      ...updatedBooking,
      tickets: newTickets,
    });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update booking with tickets' });
  }
};


export const deleteBooking = async (
  req: Request,
  res: Response<{ message: string } | { error: string }>
): Promise<void> => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
      .select()
      .single(); 

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    if (!data) {
      res.status(404).json({ error: 'Booking not found or already deleted' });
      return;
    }
    res.json({ message: `Booking ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};
