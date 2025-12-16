-- Create storage bucket for tag images
insert into storage.buckets (id, name, public)
values ('tag-images', 'tag-images', true);

-- Set up storage policies
create policy "Public read access"
on storage.objects for select
using ( bucket_id = 'tag-images' );

create policy "Authenticated users can upload"
on storage.objects for insert
with check (
  bucket_id = 'tag-images'
  and auth.role() = 'authenticated'
);

create policy "Users can update own images"
on storage.objects for update
using (
  bucket_id = 'tag-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own images"
on storage.objects for delete
using (
  bucket_id = 'tag-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
