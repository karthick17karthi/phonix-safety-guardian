
import React, { useState } from 'react';
import { User, Phone, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const sampleContacts: Contact[] = [
  { id: '1', name: 'Priya Sharma', phone: '+91 98765 43210', relation: 'Sister' },
  { id: '2', name: 'Deepak Patel', phone: '+91 87654 32109', relation: 'Father' },
  { id: '3', name: 'Anjali Mehta', phone: '+91 76543 21098', relation: 'Friend' },
];

const ContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact>({
    id: '', name: '', phone: '', relation: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const openAddDialog = () => {
    setCurrentContact({ id: '', name: '', phone: '', relation: '' });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setCurrentContact(contact);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSaveContact = () => {
    if (!currentContact.name || !currentContact.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    if (isEditing) {
      const updatedContacts = contacts.map(contact => 
        contact.id === currentContact.id ? currentContact : contact
      );
      setContacts(updatedContacts);
      toast.success(`${currentContact.name} updated successfully`);
    } else {
      const newContact = {
        ...currentContact,
        id: Date.now().toString(),
      };
      setContacts([...contacts, newContact]);
      toast.success(`${newContact.name} added as emergency contact`);
    }
    
    setIsDialogOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    const contactToDelete = contacts.find(contact => contact.id === id);
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    toast.success(`${contactToDelete?.name} removed from emergency contacts`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentContact({
      ...currentContact,
      [name]: value
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-phoenix-blue mb-2">Emergency Contacts</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add and manage trusted contacts who will be notified in case of emergency
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <Button onClick={openAddDialog} className="bg-phoenix-teal hover:bg-phoenix-teal/80">
          <Plus className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No emergency contacts yet</h3>
          <p className="text-gray-600 mb-4">Add trusted friends and family who can help in emergencies</p>
          <Button onClick={openAddDialog} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Your First Contact
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-phoenix-teal/10 p-4 flex items-center space-x-4">
                  <div className="bg-phoenix-teal rounded-full p-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.relation}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    <Phone className="h-4 w-4 text-phoenix-teal mr-2" />
                    <span>{contact.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-phoenix-blue"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-phoenix-red border-phoenix-red/30 hover:bg-phoenix-red/10"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Contact name"
                value={currentContact.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+91 98765 43210"
                value={currentContact.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relation">Relationship</Label>
              <Input
                id="relation"
                name="relation"
                placeholder="e.g. Sister, Friend, Parent"
                value={currentContact.relation}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact} className="bg-phoenix-teal hover:bg-phoenix-teal/80">
              {isEditing ? 'Update Contact' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactsPage;
