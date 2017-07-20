class License:
    _ajustes = True
    _exclusiones = True
    _consultas = True

    @property
    def ajustes(self):
        return self._ajustes

    @ajustes.setter
    def ajustes(self, value):
        self._ajustes = value

    @property
    def exclusiones(self):
        return self._exclusiones

    @exclusiones.setter
    def exclusiones(self, value):
        self._exclusiones = value

    @property
    def consultas(self):
        return self._consultas

    @consultas.setter
    def consultas(self, value):
        self._consultas = value
