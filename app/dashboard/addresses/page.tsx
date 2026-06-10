'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Address } from '@/lib/types';

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    if (data) setAddresses(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      if (editingAddress) {
        await supabase
          .from('addresses')
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq('id', editingAddress.id);
      } else {
        await supabase.from('addresses').insert({
          ...form,
          user_id: user.id,
          type: 'shipping',
        });
      }
      setDialogOpen(false);
      setEditingAddress(null);
      setForm({
        full_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'United States',
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    fetchAddresses();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);
    await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id);
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-20">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/dashboard">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Addresses</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Saved Addresses</h1>
            <Button
              onClick={() => {
                setEditingAddress(null);
                setForm({
                  full_name: '',
                  phone: '',
                  address_line1: '',
                  address_line2: '',
                  city: '',
                  state: '',
                  postal_code: '',
                  country: 'United States',
                });
                setDialogOpen(true);
              }}
              className="bg-orange hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>

          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-orange" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{address.full_name}</p>
                            {address.is_default && (
                              <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.country}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Phone: {address.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingAddress(address);
                            setForm({
                              full_name: address.full_name,
                              phone: address.phone,
                              address_line1: address.address_line1,
                              address_line2: address.address_line2 || '',
                              city: address.city,
                              state: address.state,
                              postal_code: address.postal_code,
                              country: address.country,
                            });
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => handleDelete(address.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {!address.is_default && (
                      <Button
                        variant="link"
                        className="mt-4 p-0 h-auto text-orange"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Set as default
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">No addresses saved</h2>
              <p className="text-muted-foreground mb-6">
                Add an address for faster checkout.
              </p>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-orange hover:bg-orange-600"
              >
                Add Your First Address
              </Button>
            </div>
          )}
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input
                  value={form.address_line1}
                  onChange={(e) => setForm({ ...form, address_line1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2 (Optional)</Label>
                <Input
                  value={form.address_line2}
                  onChange={(e) => setForm({ ...form, address_line2: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input
                    value={form.postal_code}
                    onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full bg-orange hover:bg-orange-600">
                Save Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
