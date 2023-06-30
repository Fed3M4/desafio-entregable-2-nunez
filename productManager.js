const fs = require('fs');

class ProductManager {
    lastId = 0;
    productos = [];
    path = '';
  
    constructor(path) {
      this.setPath(path);
    }
  
    setPath(path) {
      this.path = path;
      if ( fs.existsSync(this.path) ) {
        this.loadProductos()
      } else{
        this.saveFile();
      }
    }
  
    loadProductos() {
      try {
        const content = fs.readFileSync(this.path,'utf-8')
        const { productos, lastId } = JSON.parse(content);
        this.productos = productos;
        this.lastId = lastId;
      } catch (error) {
        console.error('Error cargando archivo:', error);
      }
    }
  
    saveFile() {
      const content = JSON.stringify({ productos: this.productos, lastId: this.lastId });
      try {
          fs.writeFileSync(this.path, content)
      } catch (error){
          console.error('Error guardando archivo:', error)
      }
    }
  
    isProductValid(producto) {
      return (
        producto &&
        typeof producto.description === 'string' &&
        typeof producto.price === 'number' &&
        typeof producto.id === 'undefined' &&
        typeof producto.title === 'string' &&

        producto.price >= 0 &&
        Array.isArray(producto.thumbnails) &&
        typeof producto.code === 'string' &&
        typeof producto.stock === 'number' &&
        producto.stock >= 0
      );
    }
  
    isProductCodeDuplicate(code) {
      return this.productos.some((producto) => producto.code === code);
    }
  
    generateProductId() {
      return ++this.lastId;
    }
  
    addProduct(producto) {
      if (!this.isProductValid(producto)) {
        throw new Error('Producto inválido');
      }
  
      this.loadProductos();
  
      if (this.isProductCodeDuplicate(producto.code)) {
        throw new Error('Un producto con el mismo código ya existe');
      }
  
      const id = this.generateProductId();
      const newProduct = { id, ...producto };
      this.productos.push(newProduct);
  
      this.saveFile();
    }
  
    getProductos() {
      this.loadProductos();
      return this.productos;
    }
  
    getProductById(id) {
      this.loadProductos();
  
      const producto = this.productos.find((p) => p.id === id);
  
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
  
      return producto;
    }
  
    deleteProduct(id) {
      this.loadProductos();
  
      const productIndex = this.productos.findIndex((p) => p.id === id);
  
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }
  
      this.productos.splice(productIndex, 1);
  
      this.saveFile();
    }
  
    updateProduct(id, producto) {
      if (!this.isProductValid(producto)) {
        throw new Error('producto inválido');
      }
  
      this.loadProductos();
  
      const productIndex = this.productos.findIndex((p) => p.id === id);
  
      if (productIndex === -1) {
        throw new Error('Producto no encontrado');
      }
  
      const updatedProduct = { id, ...product };
      this.productos[productIndex] = updatedProduct;
  
      this.saveFile();
    }
  }
  
  export default ProductManager;