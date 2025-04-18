
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle, ArrowUpCircle, ArrowDownCircle, Check, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface HeaderLink {
  id: string;
  title: string;
  url: string;
  order_number: number;
  is_active: boolean;
}

const HeaderMenuManager = () => {
  const [links, setLinks] = useState<HeaderLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentLink, setCurrentLink] = useState<HeaderLink | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Fetch links from database
  const fetchLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("header_menu_links")
        .select("*")
        .order("order_number");

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error("Error fetching header links:", error);
      toast.error("Failed to load header links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleOpenDialog = (link: HeaderLink | null = null) => {
    if (link) {
      setCurrentLink(link);
      setFormTitle(link.title);
      setFormUrl(link.url);
      setFormIsActive(link.is_active);
      setIsCreating(false);
    } else {
      setCurrentLink(null);
      setFormTitle("");
      setFormUrl("");
      setFormIsActive(true);
      setIsCreating(true);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setCurrentLink(null);
  };

  const handleSaveLink = async () => {
    if (!formTitle.trim() || !formUrl.trim()) {
      toast.error("Title and URL are required");
      return;
    }

    setLoading(true);
    try {
      if (isCreating) {
        // Create new link
        const newOrderNumber = links.length > 0 
          ? Math.max(...links.map(link => link.order_number)) + 1 
          : 1;

        const { error } = await supabase
          .from("header_menu_links")
          .insert({
            title: formTitle,
            url: formUrl,
            is_active: formIsActive,
            order_number: newOrderNumber
          });

        if (error) throw error;
        toast.success("Link added successfully");
      } else if (currentLink) {
        // Update existing link
        const { error } = await supabase
          .from("header_menu_links")
          .update({
            title: formTitle,
            url: formUrl,
            is_active: formIsActive
          })
          .eq('id', currentLink.id);

        if (error) throw error;
        toast.success("Link updated successfully");
      }

      handleCloseDialog();
      fetchLinks();
    } catch (error) {
      console.error("Error saving header link:", error);
      toast.error("Failed to save header link");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("header_menu_links")
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Link deleted successfully");
      fetchLinks();
    } catch (error) {
      console.error("Error deleting header link:", error);
      toast.error("Failed to delete header link");
    } finally {
      setLoading(false);
    }
  };

  const handleReorderLink = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = links.findIndex(link => link.id === id);
    if (currentIndex === -1) return;

    // Can't move up if already at the top
    if (direction === 'up' && currentIndex === 0) return;
    
    // Can't move down if already at the bottom
    if (direction === 'down' && currentIndex === links.length - 1) return;

    const newLinks = [...links];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap order numbers
    const tempOrderNumber = newLinks[currentIndex].order_number;
    newLinks[currentIndex].order_number = newLinks[swapIndex].order_number;
    newLinks[swapIndex].order_number = tempOrderNumber;

    // Swap positions in array
    [newLinks[currentIndex], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[currentIndex]];
    
    setLoading(true);
    try {
      // Update both links with their new order numbers
      const updates = [
        {
          id: newLinks[currentIndex].id,
          order_number: newLinks[currentIndex].order_number
        },
        {
          id: newLinks[swapIndex].id,
          order_number: newLinks[swapIndex].order_number
        }
      ];
      
      // Update both items
      for (const update of updates) {
        const { error } = await supabase
          .from("header_menu_links")
          .update({ order_number: update.order_number })
          .eq('id', update.id);
        
        if (error) throw error;
      }
      
      setLinks(newLinks);
      toast.success("Menu order updated");
    } catch (error) {
      console.error("Error reordering menu links:", error);
      toast.error("Failed to reorder menu links");
      // Refresh to get the original order
      fetchLinks();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("header_menu_links")
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setLinks(links.map(link => 
        link.id === id ? { ...link, is_active: !currentStatus } : link
      ));
      
      toast.success(`Link ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error("Error toggling link status:", error);
      toast.error("Failed to update link status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Menu Navigation</CardTitle>
            <CardDescription>
              Gérez les liens qui apparaissent dans la barre de navigation
            </CardDescription>
          </div>
          <Button 
            onClick={() => handleOpenDialog()}
            className="bg-festival-accent hover:bg-festival-accent/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un lien
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && links.length === 0 ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-festival-primary align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Chargement des liens...</p>
          </div>
        ) : links.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Aucun lien n'a été ajouté</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-center">Actif</TableHead>
                <TableHead>Ordre</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      {link.url}
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title={`Voir ${link.title}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={link.is_active}
                      onCheckedChange={() => handleToggleActive(link.id, link.is_active)}
                      disabled={loading}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReorderLink(link.id, 'up')}
                        disabled={loading}
                        title="Move Up"
                      >
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReorderLink(link.id, 'down')}
                        disabled={loading}
                        title="Move Down"
                      >
                        <ArrowDownCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDialog(link)}
                        disabled={loading}
                        title="Edit Link"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        title="Delete Link"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isCreating ? 'Ajouter un nouveau lien' : 'Modifier le lien'}</DialogTitle>
              <DialogDescription>
                {isCreating 
                  ? 'Ajoutez un nouveau lien à la barre de navigation'
                  : 'Modifiez les détails du lien existant'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Accueil, À propos, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="/about, /events, etc."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formIsActive}
                  onCheckedChange={setFormIsActive}
                />
                <Label htmlFor="active">Afficher dans le menu</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={loading}>
                <X className="mr-2 h-4 w-4" /> Annuler
              </Button>
              <Button onClick={handleSaveLink} disabled={loading}>
                <Check className="mr-2 h-4 w-4" /> {isCreating ? 'Ajouter' : 'Sauvegarder'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default HeaderMenuManager;
