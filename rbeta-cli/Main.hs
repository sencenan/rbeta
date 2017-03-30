import Control.Monad
import Data.Semigroup ((<>))

import qualified Options.Applicative as Opt
import Options.Applicative ((<**>))

data Sample
   = Sample {
      hello::String,
      quiet::Bool,
      repeat::Int
   }

sample :: Opt.Parser Sample
sample = Sample
   <$> Opt.strOption
      ( Opt.long "hello"
      <> Opt.metavar "TARGET"
      <> Opt.help "Target for the greeting" )
   <*> Opt.switch
      ( Opt.long "quiet"
      <> Opt.short 'q'
      <> Opt.help "Whether to be quiet" )
   <*> Opt.option Opt.auto
      ( Opt.long "repeat"
      <> Opt.help "Repeats for greeting"
      <> Opt.showDefault
      <> Opt.value 1
      <> Opt.metavar "INT" )

main :: IO ()
main = greet =<< Opt.execParser opts
   where
      opts = Opt.info (Opt.helper <*> sample)
         (
            Opt.fullDesc
            <> Opt.progDesc "Print a greeting for TARGET"
            <> Opt.header "hello - a test for optparse-applicative"
         )

greet :: Sample -> IO ()
greet (Sample h False n) = replicateM_ n . putStrLn $ "Hello, " ++ h
greet _ = return ()
