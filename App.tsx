import { useEffect, useState } from "react"
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  ActivityIndicator, 
  ImageBackground,
  Dimensions
} from "react-native"
import invert from 'invert-color'
import {QUOTE_URL, UNSPLASH_URL} from './configs'

type quote = {
  _id: string
  // The quotation text
  content: string
  // The full name of the author
  author: string
  // The `slug` of the quote author
  authorSlug: string
  // The length of quote (number of characters)
  length: number
  // An array of tag names for this quote
  tags: string
}
const {width, height} = Dimensions.get('screen')
const App = () => {
  const [isLoading, setLoading] = useState(true)
  const [responce, setResponce] = useState<any>()
  const [error, setError] = useState<any>()
  const [image, setImage] = useState<any>()
  const [color, setColor] = useState('#fff')
  const [overlayColor, setOverlayColor] = useState<any>()

  useEffect(() => {
    fetch(QUOTE_URL)
    .then(res => res.json())
    .then( 
      async (result) => {
        setImage({uri: ''})
        await setResponce(result)
        await getImage(result.tags)
        setLoading(false)
      },
      (error) => {
        setError(error)
        setLoading(false)
      }
    )
  }, [])

  const getImage = (tag: string) =>{
    fetch(`${UNSPLASH_URL}&query=${tag}`)
    .then(res => res.json())
    .then(
      async (data) => {
        // console.log('image', data.results[0].links.download)
        const url = data.results[0].links.download
        const imageColor = data.results[0].color
        const c = await invert(imageColor, true)
        setColor(c)
        const {b, g, r} = invert.asRGB(c)
        setOverlayColor(`rgba(${r},${g},${b},0.4)`)
        setImage({uri: url})
      },
      (err) => {
        console.log('Image Error: ', err)
      }
    )
  }

  const getContent = () => { 
    if(isLoading) return <ActivityIndicator size={'large'} /> 

    if(error) return <Text>{error}</Text>

    return (
      <ImageBackground 
        // imageStyle= {{opacity:0.7}}
        onLoad={() => {
          setLoading(false)
        }}
        style={ [styles.container,{width:width, height:height}]} source={image} resizeMode="cover">
        <View style={{backgroundColor:overlayColor, margin:20, padding:10}}>
          <Text style={[styles.h1,{textAlign:'center', color:color, opacity: 1}]}>What's the word of the day?</Text>
        <Text style={[styles.h1,{textAlign:'center', color:color}]}>{responce.content}</Text>
        <Text style={[{fontSize:18, textAlign:'center', fontStyle:'italic', color:color}]}>
          :{responce.author}
          {/* ({responce.dateAdded}) */}
        </Text>
        </View>
      </ImageBackground>
      
    )
    

  }

  return  (
    <SafeAreaView style={ styles.container}>
         {getContent()}
    </SafeAreaView>
  ) 

}

const styles = StyleSheet.create({
  container:{
    margin:0,
    padding:0,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    
  },
  h1:{
    margin:0,
    padding:10,
    fontSize:22,
    fontWeight:'bold'
  },
  banner:{
    padding:15,
    backgroundColor: '#1A7FDF'
  },
  overlay: {
    padding:10
  }
})

export default App