import React, { ChangeEvent, useEffect, useState } from 'react'
import { Container, Typography, TextField, Button, Select, InputLabel, MenuItem, FormControl, FormHelperText } from "@material-ui/core"
import './CadastroPost.css';
import {useNavigate, useParams } from 'react-router-dom'
import Tema from '../../../models/Tema';
import Postagem from '../../../models/Postagem';
import { busca, buscaId, post, put } from '../../../service/Service';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TokenState } from '../../../store/tokens/tokensReducer';

function CadastroPost() {

    let navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const token = useSelector<TokenState, TokenState['tokens']>(
        (state) => state.tokens
      )

    // const userId = useSelector<TokenState, TokenState['id']>(
	// 	(state) => state.id
	// )

    useEffect(() => {
        if (token == '') {
            toast.error('Você precisa estar logado', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            });
            navigate('/login')

        }
    }, [token])  
    
    const [temas, setTemas] = useState<Tema[]>([])

    const [tema, setTema] = useState<Tema>(
        {
            id: 0,
            nome: '',
            hashtag:''
        })

    const [postagem, setPostagem] = useState<Postagem>({
        id: 0,
        titulo: '',
        midia_url:'',
        texto: '',
        // data: '',
        tema: null
        // usuario: null
    }) 

    // const [usuario,setUsuario] = useState<User>({
    //     id: +userId,
    //     nome:'',
    //     usuario: '',
    //     senha: '',
    //     foto_url: '',
    //     tipo_usuario:''
    //   })

    function updatedPostagem(e: ChangeEvent<HTMLInputElement>) {

        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value,
            tema: tema
            
        })

    }
    
    async function getTemas() {
        await busca("/temas", setTemas, {
            headers: {
                'Authorization': token
            }
        })
    }

    useEffect(() => { 
        setPostagem({
            ...postagem,
            tema: tema,
            // usuario: usuario
        })
        console.log(postagem)
    }, [tema])

    async function findByIdPostagem(id: string) {
        await buscaId(`postagens/${id}`, setPostagem, {
            headers: {
                'Authorization': token
            }
        })
    } 

    useEffect(() => {
        getTemas()
        if (id !== undefined) {
            findByIdPostagem(id)
        }
    }, [id])

    async function onSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()

        if (id !== undefined) {
            try {
                await put(`/postagens`, postagem, setPostagem, {
                  headers: {
                    Authorization: token
                  }
            })
            toast.success('Postagem atualizada com sucesso', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            }); 
              } catch (error) {
                alert('Falha ao atualizar a postagem') //
              }
            } else {
                try {
                await post(`/postagens`, postagem, setPostagem, {
                  headers: {
                     Authorization: token
               }
            })
            toast.success('Postagem cadastrada com sucesso', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
                progress: undefined,
            });
          }catch (error) {
                alert('Falha ao cadastrar a postagem')
              }
       }
        back()

    }

    function back() {
        navigate('/postagens')
    }

    return (
        <Container maxWidth="sm" className="topo">
            <form onSubmit={onSubmit}>
            <Typography variant="h3" color="textSecondary" component="h1" align="center" >Formulário de cadastro postagem</Typography>
                <TextField value={postagem.titulo} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)} id="titulo" label="titulo" variant="outlined" name="titulo" margin="normal" fullWidth />
                <TextField value={postagem.midia_url} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)} id="midia_url" label="Link do Arquivo" name="midia_url" variant="outlined" margin="normal" fullWidth />
                <TextField value={postagem.texto} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedPostagem(e)} id="texto" label="Texto" variant="outlined" name="texto" margin="normal" fullWidth />

                <FormControl >
                    <InputLabel id="demo-simple-select-helper-label">Tema </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        onChange={(e) => buscaId(`/temas/${e.target.value}`, setTema, {
                            headers: {
                                'Authorization': token
                            }
                        })}>
                        {
                            temas.map(tema => (
                                <MenuItem value={tema.id}>{tema.nome}</MenuItem>
                            ))
                        }
                    </Select>
                    <FormHelperText>Escolha um tema para a postagem</FormHelperText>
                    <Button type="submit" variant="contained" color="primary">
                        Finalizar
                    </Button>
                </FormControl>
            </form>
        </Container>
    )
}
export default CadastroPost;
