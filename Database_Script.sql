--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2021-03-16 16:17:56

--SET statement_timeout = 0;
--SET lock_timeout = 0;
--SET idle_in_transaction_session_timeout = 0;
--SET client_encoding = 'UTF8';
--SET standard_conforming_strings = on;
--SELECT pg_catalog.set_config('search_path', '', false);
--SET check_function_bodies = false;
--SET xmloption = content;
--SET client_min_messages = warning;
--SET row_security = off;

--SET default_tablespace = '';

--SET default_table_access_method = heap;

--DROP DATABASE "Collabboks";

--CREATE DATABASE "Collabooks"
    --WITH
    --OWNER = postgres
    --ENCODING = 'UTF8'
    --LC_COLLATE = 'English_Canada.1252'
    --LC_CTYPE = 'English_Canada.1252'
    --TABLESPACE = pg_default
    --CONNECTION LIMIT = -1;

--

-- ****** RUN THE FOLLOWING COMMANDS ON AN EMPTY DATABASE TO CREATE THE SCHEMA

-- TOC entry 205 (class 1259 OID 16406)
-- Name: book_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.book_table (
    book_id integer NOT NULL,
    title character varying(100) NOT NULL,
    author character varying(100) NOT NULL,
    isbn bigint NOT NULL,
    genre character varying(25) NOT NULL,
    owner_id integer NOT NULL,
    borrowed_by integer,
    due_date date
);


ALTER TABLE public.book_table OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16404)
-- Name: book_table_book_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.book_table ALTER COLUMN book_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.book_table_book_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1
);


--
-- TOC entry 206 (class 1259 OID 16421)
-- Name: chat_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_table (
    chat_id integer NOT NULL,
    firstp_id integer NOT NULL,
    secondp_id integer NOT NULL,
    chat_history text NOT NULL
);


ALTER TABLE public.chat_table OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 16429)
-- Name: chat_table_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.chat_table ALTER COLUMN chat_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.chat_table_chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1
);


--
-- TOC entry 202 (class 1259 OID 16394)
-- Name: user_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_table (
    user_id integer NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(30) NOT NULL,
    user_lon double precision NOT NULL,
    user_lat double precision NOT NULL,
    user_type character varying(30) NOT NULL,
    user_status "char" NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL
);


ALTER TABLE public.user_table OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16399)
-- Name: user_table_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.user_table ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_table_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 99999
    CACHE 1
);


--
-- TOC entry 2710 (class 2606 OID 16442)
-- Name: chat_table Id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_table
    ADD CONSTRAINT "Id" UNIQUE (chat_id);


--
-- TOC entry 2706 (class 2606 OID 16410)
-- Name: book_table book_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_table
    ADD CONSTRAINT book_table_pkey PRIMARY KEY (book_id);


--
-- TOC entry 2712 (class 2606 OID 16428)
-- Name: chat_table chat_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_table
    ADD CONSTRAINT chat_table_pkey PRIMARY KEY (chat_id);


--
-- TOC entry 2708 (class 2606 OID 16444)
-- Name: book_table id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_table
    ADD CONSTRAINT id UNIQUE (book_id);


--
-- TOC entry 2702 (class 2606 OID 16398)
-- Name: user_table user_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT user_table_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2704 (class 2606 OID 16446)
-- Name: user_table username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT username UNIQUE (email);


--
-- TOC entry 2714 (class 2606 OID 16416)
-- Name: book_table borrowed; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_table
    ADD CONSTRAINT borrowed FOREIGN KEY (borrowed_by) REFERENCES public.user_table(user_id) NOT VALID;


--
-- TOC entry 2715 (class 2606 OID 16431)
-- Name: chat_table first user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_table
    ADD CONSTRAINT "first user" FOREIGN KEY (firstp_id) REFERENCES public.user_table(user_id) NOT VALID;


--
-- TOC entry 2713 (class 2606 OID 16411)
-- Name: book_table owner_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.book_table
    ADD CONSTRAINT owner_id FOREIGN KEY (owner_id) REFERENCES public.user_table(user_id) NOT VALID;


--
-- TOC entry 2716 (class 2606 OID 16436)
-- Name: chat_table second user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_table
    ADD CONSTRAINT "second user" FOREIGN KEY (secondp_id) REFERENCES public.user_table(user_id) NOT VALID;


-- Completed on 2021-03-16 16:17:57

--
-- PostgreSQL database dump complete
--
