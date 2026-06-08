
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.progress;

ALTER TABLE public.progress
  ADD CONSTRAINT progress_id_name_len CHECK (char_length(id_name) BETWEEN 1 AND 80) NOT VALID,
  ADD CONSTRAINT progress_class_len CHECK (class IS NULL OR char_length(class) <= 40) NOT VALID,
  ADD CONSTRAINT progress_lista_name_len CHECK (lista_name IS NULL OR char_length(lista_name) <= 80) NOT VALID,
  ADD CONSTRAINT progress_pontuacao_range CHECK (pontuacao IS NULL OR (pontuacao >= 0 AND pontuacao <= 10000)) NOT VALID;

ALTER TABLE public.leaderboard
  ADD CONSTRAINT leaderboard_name_len CHECK (char_length(name) BETWEEN 1 AND 60) NOT VALID,
  ADD CONSTRAINT leaderboard_grade_len CHECK (char_length(grade) BETWEEN 1 AND 20) NOT VALID,
  ADD CONSTRAINT leaderboard_game_type_len CHECK (char_length(game_type) BETWEEN 1 AND 40) NOT VALID,
  ADD CONSTRAINT leaderboard_score_range CHECK (score >= 0 AND score <= 100000) NOT VALID,
  ADD CONSTRAINT leaderboard_level_range CHECK ("Level" IS NULL OR ("Level" >= 1 AND "Level" <= 9)) NOT VALID;

ALTER TABLE public.words
  ADD CONSTRAINT words_word_len CHECK (word IS NULL OR char_length(word) <= 80) NOT VALID,
  ADD CONSTRAINT words_list_name_len CHECK (list_name IS NULL OR char_length(list_name) <= 80) NOT VALID,
  ADD CONSTRAINT words_image_len CHECK (image IS NULL OR char_length(image) <= 500) NOT VALID,
  ADD CONSTRAINT words_difficulty_range CHECK (difficulty IS NULL OR (difficulty >= 0 AND difficulty <= 10)) NOT VALID;

ALTER TABLE public.linksite
  ADD CONSTRAINT linksite_materia_len CHECK (materia IS NULL OR char_length(materia) <= 80) NOT VALID,
  ADD CONSTRAINT linksite_ano_len CHECK (ano IS NULL OR char_length(ano) <= 20) NOT VALID,
  ADD CONSTRAINT linksite_descricao_len CHECK (descricao IS NULL OR char_length(descricao) <= 1000) NOT VALID,
  ADD CONSTRAINT linksite_nome_atividade_len CHECK (nome_atividade IS NULL OR char_length(nome_atividade) <= 120) NOT VALID,
  ADD CONSTRAINT linksite_link_len CHECK (link IS NULL OR char_length(link) <= 1000) NOT VALID;

REVOKE ALL ON public.admin_passwords FROM PUBLIC;
REVOKE ALL ON public.admin_passwords FROM anon;
REVOKE ALL ON public.admin_passwords FROM authenticated;
GRANT ALL ON public.admin_passwords TO service_role;

CREATE POLICY "Deny all access to admin_passwords from anon"
  ON public.admin_passwords FOR ALL TO anon
  USING (false) WITH CHECK (false);

CREATE POLICY "Deny all access to admin_passwords from authenticated"
  ON public.admin_passwords FOR ALL TO authenticated
  USING (false) WITH CHECK (false);
